#  Backend  Task

## Overview

This project implements a product catalog backend capable of handling 200,000 products with:

* Fast pagination
* Category filtering
* Consistent browsing while data changes
* PostgreSQL database
* React frontend for demonstration

The application uses cursor-based pagination to avoid duplicate or missing products when new products are inserted or updated while a user is browsing.

---

## Tech Stack

### Backend

* Node.js
* Express.js
* PostgreSQL (Neon)
* pg

### Frontend

* React
* Vite
* Axios

### Data Generation

* Faker.js

---

## Database Design

### Products Table

| Column     | Type                  |
| ---------- | --------------------- |
| id         | BIGSERIAL PRIMARY KEY |
| name       | TEXT                  |
| category   | TEXT                  |
| price      | NUMERIC               |
| created_at | TIMESTAMP             |
| updated_at | TIMESTAMP             |

### Index

```sql
CREATE INDEX idx_products_updated_id
ON products(updated_at DESC, id DESC);
```

The index matches the sorting order used by the API and improves pagination performance.

---

## Data Seeding

A seed script generates 200,000 products using Faker.

Products are inserted in batches of 1,000 records rather than individual inserts.

Benefits:

* Fewer database round trips
* Faster insertion
* Lower overhead

---

## API Endpoints

### Get Products

```http
GET /products
```

Returns the first page of products ordered by newest first.

### Filter By Category

```http
GET /products?category=Books
```

Returns only products from the specified category.

### Cursor Pagination

```http
GET /products?cursorUpdatedAt=<timestamp>&cursorId=<id>
```

Returns the next page of products after the provided cursor.

### Limit

```http
GET /products?limit=50
```

Allows custom page sizes with a maximum limit of 100.

---

## Why Cursor Pagination?

Offset pagination can produce duplicates or skipped records when new products are added while users browse.

Example:

1. User loads page 1.
2. New products are inserted.
3. User requests page 2 using OFFSET.

The rows shift, causing inconsistent results.

Cursor pagination uses the last seen `(updated_at, id)` pair and guarantees stable traversal through the dataset.

---

## Frontend Features

* Product listing
* Category filter
* Load More button
* Cursor-based pagination
* Responsive card layout

---

## Improvements With More Time

* Search functionality
* Infinite scrolling
* Docker support
* Automated tests
* API documentation using Swagger
* Server-side caching

---

## Running Locally

### Backend

```bash
npm install
npm run dev
```

### Seed Database

```bash
node seed/seed.js
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```
