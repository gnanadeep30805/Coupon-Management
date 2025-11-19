# Run Instructions — Coupon Management System

## Backend: Install & Start

- Install dependencies (from `backend/`):

```powershell
cd "d:\web dev\coupon-system\backend"
npm.cmd install
```

- Create environment file `backend/.env` with your DB connection (example):

```
DATABASE_URL=postgresql://postgres:password@localhost:5432/couponsdb
# Optional for dev without Postgres:
# USE_MOCK_DB=true
```

- Start server (port 4000):

```powershell
cd "d:\web dev\coupon-system\backend"
npm.cmd start
```

## Backend — Useful REST commands (examples)

- Health check — `GET /api/health`:

```powershell
Invoke-RestMethod 'http://localhost:4000/api/health'
# curl alternative:
curl http://localhost:4000/api/health
```

- List coupons — `GET /api/coupons`:

```powershell
Invoke-RestMethod 'http://localhost:4000/api/coupons' | ConvertTo-Json -Depth 5
```

- Create coupon — `POST /api/coupons` (JSON body):

```powershell
$body = '{"code":"TEST10","description":"Demo","discountType":"PERCENT","discountValue":10,"startDate":"2025-11-01","endDate":"2026-11-01"}'
Invoke-RestMethod -Method Post -Uri 'http://localhost:4000/api/coupons' -ContentType 'application/json' -Body $body
```

## Frontend: Serve static files

- Start a static server from project root (serves `frontend/` on port 3000):

```powershell
cd "d:\web dev\coupon-system"
npx http-server frontend -p 3000
```

- Open the UI in your browser:

  - `http://localhost:3000/list-coupons.html`

## Expose publicly (temporary)

- Use `localtunnel` to create a temporary public URL for a port:

```powershell
npx localtunnel --port 3000   # frontend
npx localtunnel --port 4000   # backend
```

## Notes & Tips

- To develop without installing Postgres, set `USE_MOCK_DB=true` in `backend/.env` — the server includes a lightweight mock DB for demo.
- For production or persistent testing, run Postgres (Docker or native), load `schema.sql`, and set `DATABASE_URL` accordingly.

If you want, I can add these sections directly into `README.md` or create npm scripts for convenience.
