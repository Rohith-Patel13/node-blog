# Blog Backend API

## Overview

This is the backend API for a simple blogging platform. It provides endpoints for managing users, blogs, comments, and friend levels.

## Technologies

- Node.js with Express.js
- SQLite Database


1. Install dependencies:
"dependencies": {
    "bcrypt": "^5.1.1",
    "express": "^4.18.2",
    "sqlite": "^5.0.1",
    "sqlite3": "^5.1.6"
}



2. run "npm start" in terminal
The server runs on http://localhost:8383/.

## API Endpoints

- **Get all users**: `GET /users`
- **Create a new user**: `POST /users`
- **Get a user by ID**: `GET /users/:userId`
- **Update a user by ID**: `PUT /users/:userId`
- **Delete a user by ID**: `DELETE /users/:userId`

- **Get all blogs**: `GET /blogs`
- **Create a new blog**: `POST /blogs`
- **Get a blog by ID**: `GET /blogs/:blogId`
- **Update a blog by ID**: `PUT /blogs/:blogId`
- **Delete a blog by ID**: `DELETE /blogs/:blogId`

- **Get all comments**: `GET /comments`
- **Create a new comment**: `POST /comments`
- **Get a comment by ID**: `GET /comments/:commentId`
- **Update a comment by ID**: `PUT /comments/:commentId`
- **Delete a comment by ID**: `DELETE /comments/:commentId`

- **Get 1st level friends of a user**: `GET /users/:userId/level/1`
- **Get 2nd level friends of a user**: `GET /users/:userId/level/2`

## Database Schema

- `users`: Stores user information.
- `blogs`: Stores blog posts.
- `comments`: Stores comments.
- `friends`: Stores friend relationships.

## License

This project is licensed under the MIT License.
