# Umbraco Node API

This project is the middle layer between the Umbraco CMS and the React frontend. It fetches data from the Umbraco Delivery API, cleans it, structures it, and exposes it through simple REST endpoints. This keeps the frontend clean and prevents any direct calls to the CMS.

## Why This API Exists

The idea is to keep the frontend lightweight. The React app does not talk to Umbraco directly. Instead, it calls this Node API. This allows me to add caching, transform the content, handle errors, and keep the CMS endpoint private when running in production.

## Features

- Fetches Umbraco content through the Delivery API
- Converts the raw content into clean and predictable JSON
- Caches data in memory for faster responses during development
- Provides simple endpoints for the frontend

## Available Endpoints

```
GET /api/home
GET /api/projects
GET /api/projects/:slug

```

Each endpoint returns already structured data including title, slug, images, and HTML markup.

## Folder Structure

- backend/
  - routes/
    - home.js
    - projects.js
  - lib/
    - fetch.js
    - helpers.js
  - server.js

This structure keeps each concern separate, which makes the API easy to maintain.

## How To Run Locally

1. Install dependencies:
   `npm install`
2. Create a `.env` file with:
   `CMS_BASE=https://localhost:xxxx`
3. Start the API:
   `npm run dev`
4. The server will start on:
   `http://localhost:4000`

## Version Info

- Node.js
- Express
