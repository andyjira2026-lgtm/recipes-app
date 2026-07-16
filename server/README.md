# Recipes Server

Express + MongoDB backend for the Recipes App.

## Prerequisites
- Node.js 18+
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster (free tier works fine)

## Local Setup

```bash
cd server
cp .env.example .env      # fill in your values
npm install
npm run dev               # starts on http://localhost:5000
```

### Environment Variables

| Variable       | Description                                                 |
|----------------|-------------------------------------------------------------|
| `MONGO_URI`    | MongoDB Atlas connection string                             |
| `JWT_SECRET`   | Long random string used to sign JWTs (keep this secret)     |
| `PORT`         | Port the server listens on (default `5000`)                 |
| `FRONTEND_URL` | Production frontend origin for CORS (e.g. GitHub Pages URL) |

### Getting a MongoDB Atlas connection string

1. Create a free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free **M0** cluster.
3. Under **Database Access**, create a user with "Read and Write" rights.
4. Under **Network Access**, add your IP (or `0.0.0.0/0` for development).
5. Click **Connect → Drivers**, copy the connection string.
6. Replace `<password>` with your database user's password and add `/recipesapp` before the `?` query string as the database name.

Example:
```
mongodb+srv://myuser:mypassword@cluster0.abcde.mongodb.net/recipesapp?retryWrites=true&w=majority
```

## Deploying to Render.com

1. Push the `server/` folder to GitHub (or the whole monorepo).
2. On [render.com](https://render.com), create a **New Web Service**.
3. Connect your repository. Set the **Root Directory** to `server` if it's a monorepo.
4. Build command: `npm install`
5. Start command: `node index.js`
6. Add all environment variables (`MONGO_URI`, `JWT_SECRET`, `PORT`, `FRONTEND_URL`) under **Environment**.
7. Deploy. Copy the service URL (e.g. `https://recipes-server-xxxx.onrender.com`).
8. In your frontend project root, set `VITE_API_URL=https://recipes-server-xxxx.onrender.com` in your production environment or in a `.env.production` file.

## API Reference

| Method | Path                  | Auth | Description                      |
|--------|-----------------------|------|----------------------------------|
| POST   | /api/auth/register    | –    | Register a new user              |
| POST   | /api/auth/login       | –    | Log in, receive JWT              |
| GET    | /api/users/me         | ✓    | Get current user profile         |
| PUT    | /api/users/me/pic     | ✓    | Update profile picture           |
| GET    | /api/recipes          | ✓    | List all recipes (newest first)  |
| POST   | /api/recipes          | ✓    | Submit a recipe                  |
| GET    | /api/recipes/:id      | ✓    | Get a single recipe by id        |

Protected routes require `Authorization: Bearer <token>` header.
