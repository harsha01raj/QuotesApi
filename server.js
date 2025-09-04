const express = require("express");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();
const PORT = 3000;

// Quotes data
const quotes = [
  "The only way to do great work is to love what you do. - Steve Jobs",
  "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
  "Believe you can and you're halfway there. - Theodore Roosevelt",
  "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
  "Act as if what you do makes a difference. It does. - William James",
];

// In-memory store for rate limiting
// Key = IP, Value = { count, firstRequestTime }
const requests = new Map();

// Rate Limiter Middleware
function rateLimiter(req, res, next) {
  const ip = req.ip;
  const currentTime = Date.now();

  if (!requests.has(ip)) {
    requests.set(ip, { count: 1, firstRequestTime: currentTime });
    return next();
  }

  const requestData = requests.get(ip);
  const timePassed = (currentTime - requestData.firstRequestTime) / 1000; // seconds

  if (timePassed < 60) {
    if (requestData.count < 5) {
      requestData.count += 1;
      requests.set(ip, requestData);
      return next();
    } else {
      const retryAfter = 60 - Math.floor(timePassed);
      return res.status(429).json({
        error: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
      });
    }
  } else {
    // Reset after 1 minute
    requests.set(ip, { count: 1, firstRequestTime: currentTime });
    return next();
  }
}

// Logging Middleware (logs IP + status after response finishes)
app.use((req, res, next) => {
  res.on("finish", () => {
    console.log(`IP: ${req.ip}, Status: ${res.statusCode}`);
  });
  next();
});

// Swagger Setup
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Quote API",
      version: "1.0.0",
      description: "A simple API that returns random inspirational quotes with rate limiting",
    },
  },
  apis: ["./server.js"], // JSDoc annotations
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /api/quote:
 *   get:
 *     summary: Get a random inspirational quote
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 quote:
 *                   type: string
 *                   example: "The only way to do great work is to love what you do. - Steve Jobs"
 *       429:
 *         description: Too Many Requests
 */
app.get("/api/quote", rateLimiter, (req, res) => {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  res.json({ quote: randomQuote });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
