# Node.js Express registration

The Express server serves the frontend from `public/` and its registration/login APIs from the same origin. User records are stored in a local JSON file; passwords are stored as bcrypt hashes.

## Run locally

1. Copy `.env.example` to `.env` if you want to set a custom `USER_STORE_PATH`. The default is `data/users.json`.
2. Run `npm install`.
3. Run `npm start` and open `http://localhost:3000`.

The JSON file is created on first successful registration. It is ignored by Git.

## API

All request bodies are JSON.

| Method | Path | Body | Expected result |
|---|---|---|---|
| `POST` | `/api/auth/register` | `{"name":"Ada Lovelace","email":"ada@example.com","password":"..."}` | `201`; duplicate email returns `409` |
| `POST` | `/api/auth/login` | `{"email":"ada@example.com","password":"..."}` | `200`; invalid credentials return `401` |
| `GET` | `/health` | — | `200` with `{"status":"ok","storage":"local-file"}` |

Registration requires a name, email, and password of at least six characters. Missing/invalid fields return `400`.

## Render deployment

[`render.yaml`](./render.yaml) configures a Node Web Service using `npm install` and `npm start`. The static frontend and APIs share one public service URL. Start deployment from the [Render Blueprint link](https://render.com/deploy?repo=https://github.com/budigeashwinigoud-glitch/nodejs-express-user-registration), connect GitHub, and follow Render's prompts. After deployment, Render shows the assigned `onrender.com` URL; verify `https://<service>.onrender.com/health`.

This Blueprint intentionally stores the JSON file at `/tmp/registration-users.json` on Render's free service. Free-service local storage is ephemeral: user records may be lost when Render restarts or redeploys the app. Do not use this storage mode for important or production accounts. A persistent Render disk requires a paid web service.

## Postman

Replace `<BASE_URL>` with the deployed Render URL. For POST requests, use `Content-Type: application/json`.

1. `GET <BASE_URL>/health` — expect `200`.
2. `POST <BASE_URL>/api/auth/register` with a new name, email, and password — expect `201`.
3. Repeat with the same email — expect `409`.
4. `POST <BASE_URL>/api/auth/login` with the registered credentials — expect `200`.
5. Try missing fields (expect `400`) and a wrong password (expect `401`).
