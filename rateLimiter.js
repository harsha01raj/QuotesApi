// In-memory store for all requests
// Structure: { ip: { count, firstRequestTime } }
const requests = new Map();

/**
 * Custom Rate Limiter Middleware
 * @param {number} limit - max requests allowed
 * @param {number} windowSec - time window in seconds
 */
function createRateLimiter(limit, windowSec) {
  return function (req, res, next) {
    const ip = req.ip;
    const currentTime = Date.now();

    if (!requests.has(ip)) {
      requests.set(ip, { count: 1, firstRequestTime: currentTime });
      return next();
    }

    const requestData = requests.get(ip);
    const timePassed = (currentTime - requestData.firstRequestTime) / 1000;

    if (timePassed < windowSec) {
      if (requestData.count < limit) {
        requestData.count += 1;
        requests.set(ip, requestData);
        return next();
      } else {
        const retryAfter = windowSec - Math.floor(timePassed);
        return res.status(429).json({
          error: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
        });
      }
    } else {
      requests.set(ip, { count: 1, firstRequestTime: currentTime });
      return next();
    }
  };
}

module.exports = createRateLimiter;
