# Notes App

A simple web-based notes application built with Node.js, Express, EJS, MongoDB, and Tailwind CSS.

> ⚠️ This project is under active development. Features and UI may change.

## Features

- JWT-based user authentication (register, login, protected routes)
- Create, read, update, and delete notes
- Responsive UI built with Tailwind CSS
- Profile management (edit username/email, change password)
- Basic insights: total/recent notes, average note length
- Member since date persisted and displayed on profile

## Tech Stack

- Node.js + Express
- EJS templating
- MongoDB with Mongoose
- Tailwind CSS v4
- JWT + bcrypt

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A running MongoDB instance (local or hosted)

### Installation

1. Install dependencies:

   ```
   npm install
   ```

2. Create a .env file in the project root:

   ```
   MONGO_URI=mongodb://localhost:27017/notes_app
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

3. Start the server:

   ```
   node server.js
   ```

4. Open the app:

   http://localhost:5000

### Run in Electron shell

This project includes an Electron entry (main.js). You can launch the desktop shell:

```
npx electron .
```

Note: The Express server must be running for the UI to function.

## API Overview

- POST /register — Create a new user
- POST /login — Authenticate and receive a JWT token
- GET /api/profile — Get current user profile (Authorization: Bearer <token>)
- PUT /api/profile — Update username/email (Authorization required)
- PUT /api/profile/password — Change password (Authorization required)
- GET /api/notes — List notes (Authorization required)
- POST /api/notes — Create note (Authorization required)
- PUT /api/notes/:id — Update note (Authorization required)
- DELETE /api/notes/:id — Delete note (Authorization required)

## Security

- Passwords are hashed with bcrypt
- JWT tokens expire after 1 hour
- Protected routes require an Authorization: Bearer <token> header

## Development

Tailwind CSS is already built to public/output.css. If you change styles, rebuild:

```
npx @tailwindcss/cli -i ./public/input.css -o ./public/output.css --minify
```

## Roadmap

- Note search and tags
- Dark mode
- Unit/integration tests

## License

ISC
