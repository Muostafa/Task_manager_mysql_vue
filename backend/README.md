# Task Management API

This is a simple task management API built with Node.js, Express, and MySQL.

## Prerequisites

- Node.js
- MySQL

## Getting Started

1.  **Clone the repository:**

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up the database:**

    - Make sure you have MySQL installed and running.
    - Create a new database named `task_manager`.
    - Run the following SQL queries to create the `users` and `tasks` tables:

      ```sql
      CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
      ```

4.  **Configure environment variables:**

    - Create a `.env` file in the root of the project.
    - Add the following variables to the `.env` file, replacing the placeholder values with your actual credentials:

      ```
      DB_HOST=localhost
      DB_USER=root
      DB_PASSWORD=your_password
      DB_NAME=task_manager
      JWT_SECRET=your_jwt_secret
      PORT=5000
      ```

5.  **Start the server:**

    ```bash
    npm start
    ```

    The server will start on port 5000.

## API Endpoints

Here are some examples of how to use the API endpoints with `curl`.

### Authentication

**Register a new user**

```bash
curl -X POST http://localhost:5000/api/auth/register \
-H "Content-Type: application/json" \
-d '{
  "username": "testuser",
  "password": "password123"
}'
```

**Login**

```bash
curl -X POST http://localhost:5000/api/auth/login \
-H "Content-Type: application/json" \
-d '{
  "username": "testuser",
  "password": "password123"
}'
```

This will return a JWT token that you need to use for the protected routes.

### Tasks

Replace `YOUR_JWT_TOKEN` with the token you received after logging in.

**Create a new task**

```bash
curl -X POST http://localhost:5000/api/tasks \
-H "Content-Type: application/json" \
-H "Authorization: Bearer YOUR_JWT_TOKEN" \
-d '{
  "title": "My first task",
  "description": "This is a description for my first task."
}'
```

**Get all tasks**

```bash
curl -X GET http://localhost:5000/api/tasks \
-H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Get a single task**

Replace `:id` with the ID of the task you want to retrieve.

```bash
curl -X GET http://localhost:5000/api/tasks/:id \
-H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Update a task**

Replace `:id` with the ID of the task you want to update.

```bash
curl -X PUT http://localhost:5000/api/tasks/:id \
-H "Content-Type: application/json" \
-H "Authorization: Bearer YOUR_JWT_TOKEN" \
-d '{
  "title": "Updated task title",
  "description": "Updated task description.",
  "status": "in-progress"
}'
```

**Delete a task**

Replace `:id` with the ID of the task you want to delete.

```bash
curl -X DELETE http://localhost:5000/api/tasks/:id \
-H "Authorization: Bearer YOUR_JWT_TOKEN"
```
