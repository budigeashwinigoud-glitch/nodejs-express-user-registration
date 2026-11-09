# Node.js Express user registration

This application serves its HTML frontend from `public/` and exposes registration and login APIs backed by MySQL.

## Requirements

- Node.js 18 or newer
- A MySQL database

## Local setup

1. Copy `.env.example` to `.env` and set `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, and `DB_PORT`. Keep `.env` private.
2. Create the `users` table by running [`database/schema.sql`](./database/schema.sql) in the selected database. The script uses `CREATE TABLE IF NOT EXISTS` and does not delete existing data.
3. Install dependencies with `npm install`.
4. Start the server with `npm start`.

The app listens on `PORT` (default `3000`) and binds to `0.0.0.0`, as required by hosted web services. The frontend and API are served from the same origin, so browser CORS access is not enabled by default.

## API

All request bodies are JSON.

| Method | Path | Body | Success |
|---|---|---|---|
| `POST` | `/api/auth/register` | `{"name":"Ada Lovelace","email":"ada@example.com","password":"..."}` | `201`, registration message and `userId` |
| `POST` | `/api/auth/login` | `{"email":"ada@example.com","password":"..."}` | `200`, login message and user `id`, `name`, and `email` |
| `GET` | `/health` | — | `200` with database connected, or `503` if unavailable |
| `GET` | `/api/test-db` | — | Database connection check |
| `GET` | `/api/auth/test` | — | Auth route check |

Registration returns `400` when fields are missing or the password is shorter than 6 characters, and `409` when the email is already registered. Login returns `400` for missing fields and `401` for invalid credentials. Passwords are stored as bcrypt hashes.

## Render deployment

Create a Render Web Service from the existing GitHub repository. Set the root directory to the repository root, the runtime to Node, the build command to `npm install`, and the start command to `npm start`. Configure these environment variables in Render (never commit their values):

- `DB_HOST`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `DB_PORT`
- `DB_SSL=true` if required by the database provider; set `DB_SSL_CA` to its CA certificate when one is required
- `NODE_ENV=production`

Render supplies `PORT`. Configure the cloud MySQL provider to allow connections from Render, then run `database/schema.sql` against the provisioned database before testing registration. Configure Render's health check path as `/health`.

The health endpoint verifies both the web process and its database connection. A healthy response is `{"status":"ok","database":"connected"}`.

## Postman smoke tests

Replace `<BASE_URL>` with the deployed Render URL. Set `Content-Type: application/json` for POST requests.

1. `GET <BASE_URL>/health` should return `200` and report `"database":"connected"`.
2. `POST <BASE_URL>/api/auth/register` with a new name, email, and password should return `201`.
3. Repeat registration with the same email; it should return `409`.
4. `POST <BASE_URL>/api/auth/login` with the registered email/password should return `200`.
5. Try missing fields (expected `400`) and an incorrect password (expected `401`).
