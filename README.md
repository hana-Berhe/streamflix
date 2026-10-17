# StreamFlex

A Netflix-style streaming app I built as a portfolio project. It has accounts, a saved My List,
ratings, and AI movie suggestions from Google Gemini.

It started as a 7-person frontend team project. After that I added the backend myself.

**Frontend:** React 19, Vite, Redux Toolkit, React Router, Swiper, CSS modules
**Backend:** Node.js, Express 5, MySQL, express-validator, bcryptjs, JWT, Gemini API
**Data:** TMDB API

## Features

- Sign up, sign in and sign out
- Home, TV Shows, Movies, New & Popular, My List, browse by language, and search
- Hover previews, a More info popup, and a video player with trailers
- My List and ratings (Not for me / I like this / Love this!), saved for each user
- AI picks on the Home page, and a For You page where you can ask for something like
  "a slow-burn mystery series". Every pick comes with a short reason.

## Running it locally

### 1. Database

```bash
mysql -u root -p < backEnd/schema/schema.sql
```

This creates the `streamflex` database with three tables: `users`, `my_list` and `ratings`.
For a cloud database (Aiven), fill in `.env` first and run `npm run setup-db` in `backEnd`.

### 2. Backend

```bash
cd backEnd
cp .env.example .env     # add your database details and JWT_SECRET
npm install
npm run dev              # http://localhost:5000
```

### 3. Frontend

```bash
cd frontEnd
cp .env.example .env     # optional: VITE_TMDB_API_KEY for live movie data
npm install
npm run dev              # http://localhost:5173
```

### Optional keys

- Without `VITE_TMDB_API_KEY`, the app uses 16 built-in titles.
- Without `GEMINI_API_KEY`, the AI rows show "Because you liked..." picks instead.

## Backend structure

```
backEnd/
├── index.js                 starts the server after the database connects
├── schema/
│   ├── schema.sql           database tables
│   ├── db.config.js         MySQL pool and safeExecute
│   └── setup-db.js          runs schema.sql (npm run setup-db)
└── src/
    ├── mainRoutes.js        all routes under /api
    ├── api/
    │   ├── auth/            register, login, logout
    │   ├── user/            current user
    │   ├── myList/          My List
    │   ├── rating/          ratings
    │   └── ai/              Gemini suggestions
    │       (each has routes/, controller/, service/, validations/)
    ├── middleware/          authentication, rate limits, validation, errors
    └── utility/             error classes, cookie options, CORS, DB SSL
```

## How the AI picks work

1. The frontend sends what the user typed (optional) to `POST /api/ai/suggestions`.
2. The backend loads the user's ratings and My List from MySQL and turns them into a short
   text profile, like "Loved: Dark (tv)".
3. It sends that to Gemini and asks for JSON back (title, year, type and a reason).
4. The frontend looks up each title on TMDB to get the poster and trailer.
5. If Gemini isn't set up or fails, the frontend shows "Because you liked..." rows instead.

## Security

- Passwords are hashed with bcryptjs
- The login token is in an httpOnly cookie, so JavaScript can't read it
- All SQL queries use placeholders, so there's no SQL injection
- Rate limits on login and on AI requests
- Only TMDB image links can be saved

## API

All routes except register and login need the login cookie.

| Method | Route | What it does |
|---|---|---|
| POST | `/api/auth/register` | Create an account |
| POST | `/api/auth/login` | Sign in |
| POST | `/api/auth/logout` | Sign out |
| GET | `/api/users/me` | Current user |
| GET | `/api/my-list` | Get My List |
| POST | `/api/my-list` | Add a title |
| DELETE | `/api/my-list/:source/:movieId` | Remove a title |
| GET | `/api/ratings` | Get ratings |
| PUT | `/api/ratings` | Rate a title (-1, 1 or 2) |
| DELETE | `/api/ratings/:source/:movieId` | Remove a rating |
| GET | `/api/ai/status` | Is Gemini set up? |
| POST | `/api/ai/suggestions` | Get AI picks |

## Deploying

**Backend:** set `NODE_ENV=production`, `CLIENT_ORIGIN` to the frontend URL, a long random
`JWT_SECRET`, the `DB_*` values and `GEMINI_API_KEY`. If the frontend and backend are on
different domains, set `COOKIE_SAMESITE=none`. Start command: `npm start`.

**Frontend:** set `VITE_API_BASE_URL` and `VITE_TMDB_API_KEY` before building.
Build with `npm run build` and publish the `dist` folder.

## Disclaimer

StreamFlex is a portfolio project inspired by Netflix. It is not connected to Netflix, Inc.
This product uses the TMDB API but is not endorsed or certified by TMDB.
