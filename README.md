# Pastebin Lite

Pastebin Lite is a minimal Pastebin-style web application that allows users to create text pastes and share them via a unique URL.  
Each paste can optionally expire after a given time (TTL) or after a specified number of views.

The application exposes REST APIs for creating and retrieving pastes and also provides an HTML page to view a paste in the browser.

---

## Running the Project Locally

### Prerequisites
- Node.js (v18 or later)
- npm

### Steps

1. Install dependencies:
   ```bash
   npm install
2. Start the development server:
   ```
   npm run dev
3.Open the application in your browser:
  ```
   http://localhost:3000
```

### Persistence Layer

- The application uses Vercel KV as its persistence layer.

- Vercel KV is a serverless, Redis-compatible key-value store.

- Each paste is stored as a single key-value entry using a unique paste ID.

- Time-based expiration and view-count limits are enforced at read time.

- This approach avoids background jobs and works well in a stateless, serverless environment.
