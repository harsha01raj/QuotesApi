📖 Quote API

A RESTful API that returns random inspirational quotes.
Includes IP-based rate limiting, logging, and Swagger documentation.

🚀 Features

    GET /api/quote → Returns a random inspirational quote (limit: 5 requests per minute per IP).

    GET /api/test → Example test endpoint (limit: 2 requests per 30 seconds).

    Custom per-endpoint rate limits.

    Returns 429 Too Many Requests if the limit is exceeded.

    Logs each request (Client IP + Response Status).

    Swagger/OpenAPI documentation available at /api-docs.

    Unit tests included for rate-limiting logic.

🛠 Tech Stack

    Node.js + Express.js

    Swagger (OpenAPI)

    Jest + Supertest (for testing)

    ⚡ Setup Instructions

Clone the repository:

    git clone <your-repo-link>
    cd quote-api


Install dependencies:   npm install
Start the server:   node server.js

Or, during development (if you have nodemon installed): npx nodemon server.js

Open in browser:

API → http://localhost:3000/api/quote

Test endpoint → http://localhost:3000/api/test

Swagger Docs → http://localhost:3000/api-docs

🧪 Example Requests
✅ Successful Request
curl http://localhost:3000/api/quote


Response:

{
  "quote": "The only way to do great work is to love what you do. - Steve Jobs"
}

❌ Rate Limit Exceeded
{
  "error": "Rate limit exceeded. Try again in 42 seconds."
}

🧪 Running Tests

    Run unit tests for the rate limiter:

npm test

📌 Assumptions & Design Decisions

    Quotes are stored in memory (no database needed).

    Rate limiting is implemented using an in-memory Map, per assignment requirement.

    Rate limiting is applied per IP address.

    Logging is done using simple console.log for IP and response status.

📖 Deliverables

    Complete backend code (server.js, rateLimiter.js, tests).

    Setup instructions (see above).

    Example curl/Postman commands to test the API.

    Swagger documentation at /api-docs.

    Ready to deploy on any Node.js hosting service.