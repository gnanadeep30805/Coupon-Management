# 📘 Coupon Management System — README

## 📌 1. Project Overview

The Coupon Management System is a full-stack web application that allows administrators to create, store, and manage discount coupons, while user carts can be evaluated to find the best available discount. It demonstrates:

- A responsive admin UI with login/signup, coupon creation, listing, and coupon-application tester
- A Node/Express REST API with validation, business rules, and usage tracking
- PostgreSQL persistence (or an opt-in mock DB for demos/tests)

For a high-level system map, see [`ARCHITECTURE.md`](ARCHITECTURE.md).

---

## 🧩 2. Key Features

- **Authentication (frontend demo)**: Login & signup pages with localStorage persistence and route guarding.
- **Coupon CRUD**: Create coupons with discount types, eligibility JSON, usage limits, and validity windows.
- **Listing & Usage Simulation**: Paginated-style list with JSON previews and “Mark Used” demo action.
- **Apply Best Coupon**: Interactive tester that posts user/cart payloads to `/api/coupons/best`.
- **Robust Validation**: Joi validators and controller-level error handling.
- **Flexible Data Layer**: Real PostgreSQL connection or `USE_MOCK_DB=true` in-memory store.

---

## 🧰 3. Tech Stack

| Layer      | Tools                                |
|-----------|---------------------------------------|
| Frontend  | HTML5, CSS3, Vanilla JS (`frontend/`) |
| Backend   | Node.js, Express.js, Joi (`backend/`) |
| Database  | PostgreSQL (`schema.sql`)             |
| Tooling   | npm, Postman, localtunnel (optional)  |

---

## 🚀 4. Getting Started

### ⚙️ Prerequisites

| Tool        | Version |
|-------------|---------|
| Node.js     | 18+     |
| npm         | 9+      |
| PostgreSQL* | 14+     |
| Git         | Latest  |

\* Skip if you use the mock DB.

### 🔧 Setup Summary

1. **Backend**
   ```powershell
   cd "d:\web dev\coupon-system\backend"
   npm install
   ```
   - Create `.env` (see below).
   - Start: `npm start` (default port `4000`).

2. **Frontend**
   ```powershell
   cd "d:\web dev\coupon-system"
   npx http-server frontend -p 3000
   ```
   - Open `http://localhost:3000/index.html`.

3. **Environment (.env example)**
   ```
   DATABASE_URL=postgresql://postgres:password@localhost:5432/couponsdb
   USE_MOCK_DB=true          # optional; skips Postgres
   PORT=4000
   ```

4. **Expose for preview (optional)**
   ```
   npx localtunnel --port 3000   # frontend
   npx localtunnel --port 4000   # backend
   ```

Detailed setup, sample API calls, and troubleshooting tips live in [`RUN_INSTRUCTIONS.md`](RUN_INSTRUCTIONS.md).

---

## 🧪 5. Useful Endpoints

| Method | Endpoint                 | Description                    |
|--------|--------------------------|--------------------------------|
| GET    | `/api/health`            | Health check                  |
| GET    | `/api/coupons`           | List coupons                  |
| POST   | `/api/coupons`           | Create a coupon               |
| POST   | `/api/coupons/best`      | Evaluate best coupon for cart |
| POST   | `/api/coupons/use/:code` | Mark a coupon usage           |

Refer to `backend/controllers/couponsController.js` for the full flow and payload shapes.

---

## 🗂 6. Project Structure

```
coupon-system/
├── frontend/          # Login/Signup, admin pages, styles, API helper
├── backend/           # Express server, routes, controllers, models
├── schema.sql         # Database schema
├── ARCHITECTURE.md    # Mermaid diagram & flow description
├── RUN_INSTRUCTIONS.md# Detailed setup + curl samples
└── README.md          # You are here
```

---

## 🤝 7. Contributing

1. Fork & clone the repo.
2. Create a feature branch.
3. Follow the run instructions to verify frontend/backend locally.
4. Open a PR with a summary of changes, screenshots (frontend), and test notes.

---

## 📄 8. License

MIT – customize as needed for your deployment.

