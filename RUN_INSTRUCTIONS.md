# Run Instructions — Coupon Management System

## Backend: Install & Start

1. **Install dependencies**

    ```powershell
    cd "d:\web dev\coupon-system\backend"
    npm.cmd install
    ```

2. **Create `.env`**

    ```text
    DATABASE_URL=postgresql://postgres:password@localhost:5432/couponsdb
    # Optional for dev without Postgres:
    # USE_MOCK_DB=true
    PORT=4000
    ```

3. **Start the server**

    ```powershell
    cd "d:\web dev\coupon-system\backend"
    npm.cmd start
    ```

## Backend — Useful REST commands (examples)

1. **Health check** — `GET /api/health`

    ```powershell
    Invoke-RestMethod 'http://localhost:4000/api/health'
    # curl alternative:
    curl http://localhost:4000/api/health
    ```

2. **List coupons** — `GET /api/coupons`

    ```powershell
    Invoke-RestMethod 'http://localhost:4000/api/coupons' | ConvertTo-Json -Depth 5
    ```

3. **Create coupon** — `POST /api/coupons`

    ```powershell
    $body = '{"code":"TEST10","description":"Demo","discountType":"PERCENT","discountValue":10,"startDate":"2025-11-01","endDate":"2026-11-01"}'
    Invoke-RestMethod -Method Post -Uri 'http://localhost:4000/api/coupons' -ContentType 'application/json' -Body $body
    ```

## Frontend: Serve static files

1. **Start a static server** (serves `frontend/` on port 3000)

    ```powershell
    cd "d:\web dev\coupon-system"
    npx http-server frontend -p 3000
    ```

2. **Open the UI**

    - `http://localhost:3000/index.html`
    - Login → redirected to `create-coupon.html`
    - Additional pages: `list-coupons.html`, `apply-coupon.html`

## Expose publicly (temporary)

1. **Frontend tunnel**

    ```powershell
    npx localtunnel --port 3000
    ```

2. **Backend tunnel**

    ```powershell
    npx localtunnel --port 4000
    ```

## Notes & Tips

- To develop without installing Postgres, set `USE_MOCK_DB=true` in `backend/.env` — the server includes a lightweight mock DB for demo.
- For production or persistent testing, run Postgres (Docker or native), load `schema.sql`, and set `DATABASE_URL` accordingly.

If you want, I can add these sections directly into `README.md` or create npm scripts for convenience.
