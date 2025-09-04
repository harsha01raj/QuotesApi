const request = require("supertest");
const express = require("express");
const createRateLimiter = require("../rateLimiter");

const app = express();
app.get("/api/test", createRateLimiter(2, 5), (req, res) => {
  res.json({ message: "ok" });
});

describe("Rate Limiter Middleware", () => {
  it("should allow requests within limit", async () => {
    const res1 = await request(app).get("/api/test");
    expect(res1.statusCode).toBe(200);

    const res2 = await request(app).get("/api/test");
    expect(res2.statusCode).toBe(200);
  });

  it("should block requests after exceeding limit", async () => {
    await request(app).get("/api/test");
    await request(app).get("/api/test");

    const res3 = await request(app).get("/api/test");
    expect(res3.statusCode).toBe(429);
    expect(res3.body.error).toMatch(/Rate limit exceeded/);
  });
});
