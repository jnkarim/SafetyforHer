# SafetyforHer

SafetyforHer is a full-stack web application built to help women and vulnerable users learn about online safety, share community stories, and report technology-facilitated abuse anonymously. The project includes a React frontend and an Express/MongoDB backend with authentication, community posts, anonymous incident reporting, image uploads, and interactive safety scenarios.

<p align="center">
  <img src="home.jfif" alt="BookCycle Landing Page" width="600">
</p>

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [Available Routes](#available-routes)
- [API Overview](#api-overview)
- [Database Models](#database-models)
- [Useful Scripts](#useful-scripts)
- [Troubleshooting](#troubleshooting)
- [Future Improvements](#future-improvements)

## Features

### User Authentication

- User registration and login
- JWT-based protected routes
- Password hashing with bcrypt
- Auth state saved in browser local storage

### Community Feed

- Users can browse community posts
- Authenticated users can create posts
- Posts support categories such as stalking, privacy, harassment, catfishing, gaming, image abuse, doxxing, and tips
- Upvote system for posts and comments
- Commenting system
- Post search, filtering, and sorting support through backend query parameters
- Soft-delete and flagging support

### Anonymous Incident Reporting

- Users can submit incident reports without creating an account
- Reports generate a unique anonymous case code
- Users can check report status later using the case code
- Screenshot/evidence upload support through Cloudinary
- No user ID or IP tracking is stored in the incident model

### Interactive Safety Scenarios

- Scenario-based learning flow
- Tracks user choices and progress
- Completion and badge support
- Example scenario assets included for doxxing-related learning

### Multilingual Frontend

- i18next integration
- English and Bangla translation files included
- Language toggle support in multiple pages

### Responsive Frontend UI

- React Router based page navigation
- Sidebar and footer layout
- Tailwind CSS styling
- Reusable UI and layout components

## Tech Stack

### Frontend

- React 19
- Vite
- React Router DOM
- Tailwind CSS
- Axios
- i18next
- react-i18next
- Lucide React icons

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token authentication
- bcryptjs
- Multer
- Cloudinary
- multer-storage-cloudinary
- dotenv
- cors



## Environment Variables

Create a `.env` file inside the `Backend` folder.

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Optional: create a `.env` file inside the `Frontend` folder if the backend API URL is different from the default.

```env
VITE_API_URL=http://localhost:5000/api
```

By default, the frontend already falls back to:

```text
http://localhost:5000/api
```

## Installation

Clone or download the project, then install dependencies separately for backend and frontend.

### Backend setup

```bash
cd Backend
npm install
```

### Frontend setup

```bash
cd Frontend
npm install
```

## Running the Project

Open two terminal windows: one for the backend and one for the frontend.

### Start backend server

```bash
cd Backend
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

### Start frontend development server

```bash
cd Frontend
npm run dev
```

The frontend will usually run on:

```text
http://localhost:5173
```

## Available Routes


## API Overview

### Authentication API

Base path:

```text
/api/auth
```

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/register` | Public | Register a new user |
| `POST` | `/login` | Public | Login user and return token |
| `GET` | `/me` | Protected | Get current authenticated user |

### Posts API

Base path:

```text
/api/posts
```

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/` | Public/Optional Auth | Get posts with filtering, sorting, search, and pagination |
| `GET` | `/:id` | Public/Optional Auth | Get single post details |
| `POST` | `/` | Protected | Create a post |
| `POST` | `/upload-image` | Protected | Upload post image to Cloudinary |
| `PATCH` | `/:id/upvote` | Protected | Upvote or remove upvote from a post |
| `POST` | `/:id/comments` | Protected | Add comment to a post |
| `PATCH` | `/:id/comments/:commentId/upvote` | Protected | Upvote or remove upvote from a comment |
| `DELETE` | `/:id` | Protected | Soft-delete a post |
| `PATCH` | `/:id/flag` | Protected | Flag a post for review |

### Incident Reporting API

Base path:

```text
/api/incidents
```

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/report` | Public | Submit anonymous incident report with optional screenshots |
| `GET` | `/status/:caseCode` | Public | Check report status using case code |

### Scenario API

Scenario routes exist in:

```text
Backend/routes/scenarios_routes.js
```

Expected base path:

```text
/api/scenarios
```

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/` | Public/Optional Auth | Get published scenarios |
| `GET` | `/:slug` | Public/Optional Auth | Get one scenario by slug |
| `POST` | `/:slug/progress` | Protected | Save user scenario progress |
| `POST` | `/:slug/complete` | Protected | Mark scenario as completed |
| `GET` | `/user/badges` | Protected | Get completed scenario badges |

Important: in the current `Backend/server.js`, the scenario routes are not mounted yet. To enable them, import the route file and add the route middleware:

```js
import scenarioRoutes from "./routes/scenarios_routes.js";

app.use("/api/scenarios", scenarioRoutes);
```

## Database Models

### User

Stores registered user information, hashed password, role, and upvoted content references.

Main fields:

- username
- email
- password
- upvotedPosts
- upvotedComments
- role

### Post

Stores community posts, comments, upvotes, category, post type, image URL, views, delete status, and flag status.

Main fields:

- author
- title
- content
- category
- type
- upvotes
- comments
- imageUrl
- views
- isDeleted
- isFlagged

### Incident

Stores anonymous incident report details and evidence URLs.

Main fields:

- caseCode
- incidentType
- platform
- description
- offenderLink
- evidenceUrls
- status
- createdAt

### Scenario

Stores interactive safety learning scenarios and user progress.

Main fields:

- slug
- title
- subtitle
- description
- category
- difficulty
- isPublished
- playCount
- progress

## Useful Scripts

### Backend

```bash
npm run dev
```

Starts the backend server using nodemon.

### Frontend

```bash
npm run dev
```

Starts the Vite development server.

```bash
npm run build
```

Creates a production build.

```bash
npm run preview
```

Previews the production build locally.

```bash
npm run lint
```

Runs ESLint on the frontend codebase.

## Troubleshooting

### Backend cannot connect to MongoDB

Check that `MONGO_URI` is valid and that your database user has proper access permissions.

### Image upload is failing

Check these Cloudinary environment variables:

```env
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```

Also make sure the uploaded file format is one of:

```text
jpg, jpeg, png, gif, webp
```

### Frontend cannot connect to backend

Make sure the backend is running on port `5000`. If using another URL, set this in `Frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### Scenario pages are not loading data

The frontend calls `/api/scenarios`, but the backend server currently does not mount the scenario route file. Add this to `Backend/server.js`:

```js
import scenarioRoutes from "./routes/scenarios_routes.js";
app.use("/api/scenarios", scenarioRoutes);
```

### Seed script issue

The backend contains `seed.js`, but there is no seed script in `Backend/package.json` yet. You can add:

```json
"seed": "node seed.js"
```

inside the `scripts` object if you want to seed sample data using npm.

## Future Improvements

- Add admin dashboard for reviewing reports and flagged posts
- Add report status update workflow
- Add moderation tools for community posts and comments
- Add more safety scenarios such as sextortion, grooming, deepfakes, and image-based abuse
- Add automated tests for backend APIs
- Add role-based admin routes
- Improve accessibility and mobile responsiveness
- Add production deployment instructions


