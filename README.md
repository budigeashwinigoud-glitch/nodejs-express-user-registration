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

## Render backend deployment

The repository's [`render.yaml`](./render.yaml) defines a Node Web Service using `npm install`, `npm start`, and `/health`. Render supplies `PORT`. The service needs a reachable MySQL-compatible database before registration and login can work.

### Provision MySQL on Railway

Render does not offer a managed MySQL database. One option is Railway's MySQL service:

1. Create a Railway account and a new project; review the current plan and usage charges first.
2. Add a MySQL service to the project and wait for it to become available.
3. In the MySQL service settings, enable **Networking → TCP Proxy** for its MySQL port. Render cannot use Railway's private service hostname because the services are on different platforms.
4. Use the externally reachable TCP proxy hostname and port for `DB_HOST` and `DB_PORT`. Get `DB_USER`, `DB_PASSWORD`, and `DB_NAME` from the Railway MySQL service's variables. Do not use the private/internal host or expose these values in Git or chat.
5. Connect a MySQL client to that public TCP endpoint and run [`database/schema.sql`](./database/schema.sql). This creates the `users` table if absent; it does not drop or overwrite existing data.

### Create the Render service

1. Open the [Render Blueprint deploy flow](https://render.com/deploy?repo=https://github.com/budigeashwinigoud-glitch/nodejs-express-user-registration) and connect GitHub if prompted.
2. Review the Blueprint: it should create a **Node Web Service** named `user-registration-api`, in Singapore, on Render's free plan. Confirm any current plan limits before proceeding.
3. Enter the MySQL connection values in Render's prompted secret/environment-variable fields. Set `DB_SSL` to `true` only if the database provider requires TLS; otherwise set it to `false`. Never put credentials into `render.yaml`.
4. Create the Blueprint and wait for the service deploy. Check Render's deploy/runtime logs for startup or MySQL errors.
5. Visit `https://<your-service>.onrender.com/health`. A healthy response is `{"status":"ok","database":"connected"}`. A `503` means the app cannot reach MySQL or the database is unavailable.

The backend and frontend are served by the same Express service, so browser CORS is not enabled. The health endpoint verifies both the web process and its database connection.

## Postman smoke tests

Replace `<BASE_URL>` with the deployed Render URL. Set `Content-Type: application/json` for POST requests.

1. `GET <BASE_URL>/health` should return `200` and report `"database":"connected"`.
2. `POST <BASE_URL>/api/auth/register` with a new name, email, and password should return `201`.
3. Repeat registration with the same email; it should return `409`.
4. `POST <BASE_URL>/api/auth/login` with the registered email/password should return `200`.
5. Try missing fields (expected `400`) and an incorrect password (expected `401`).
