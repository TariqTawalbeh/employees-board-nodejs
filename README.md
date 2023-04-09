# Employee Management System API

This is a simple Employee Management System API built with Node.js, Express.js, Sequelize, and MySQL.

## Features

- Create, Read, Update, and Delete employee data
- Two types of users: employees and HR managers
- Authentication using Passport.js
- Input validation and error handling
- JWT-based authorization for secure data access
- MySQL database integration using Sequelize ORM

## Prerequisites

- Node.js and npm installed on your machine, preferable (Node.js v19.8.1)
- MySQL database setup with a user and password
- An IDE such as Visual Studio Code

## Installation

1. Clone the repository

`https://github.com/TariqTawalbeh/employees-board-nodejs.git`


2. Install dependencies

`cd employees-board-nodejs`

`npm install`

3. modify `knexfile.js` configurations to suit your environment

4. Run the migration [using kenx], also run the seeders

`npx knex migrate:latest`

`npx knex seed:run`


5. Create a `.env` file to add the configuration, you can check .env.example in the repo


6. Start the server

`node src/index.js`


7. Open your your api client to try the api's as follow

## Usage

### Register and Login

```http

POST /users/register

{
    "email": "taw3@asd.com",
    "password": "password123",
    "name": "tariq",
    "role_id": "1"
}
Headers:
Content-Type: application/json

Response:
{
   "id": 5,
   "name": "tariq",
   "email": "taw3@asd.com",
   "password": "$2b$10$iTPRMkux7cSj5YaneZCAT.vMhfxbXH/9ARaYPZqvZDl4f589/gv.2",
   "is_active": true,
   "role_id": "1",
   "updatedAt": "2023-04-08T23:06:11.707Z",
   "createdAt": "2023-04-08T23:06:11.707Z"
}

POST /users/login

{
    "email": "taw3@asd.com",
    "password": "password123"
}
Headers:
Content-Type: application/json

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSI."
}

```

### List/Add/Deactivate Employees
```http
GET /users

Headers:
Authorization: Bearer <access_token>

Response:
[
   {
      "id": 2,
      "name": "johndoe",
      "email": "taw@example.com",
      "phone_number": 12312254654,
      "password": "$2b$10$cdmFqQItrRenNjMZxNA4Yebjt2RbZ5oE/huMl0HWL0nQvwRcNBdWy",
      "role_id": 1,
      "is_active": true,
      "createdAt": "2023-04-08T03:18:21.000Z",
      "updatedAt": "2023-04-08T23:28:38.000Z"
   },
   {
      "id": 3,
      "name": "tariq",
      "email": "taw1@test.com",
      "phone_number": null,
      "password": "$2b$10$QK3Dj8wL4o7JpReziBASHOOGvrGzAxZW16ntJ7SX/EkTrvbQbjeYC",
      "role_id": 1,
      "is_active": true,
      "createdAt": "2023-04-08T04:07:02.000Z",
      "updatedAt": "2023-04-08T04:07:02.000Z"
   }
]


POST /users

Headers:
Authorization: Bearer <access_token>
Content-Type: application/json

Body:
{
    "name":"tariq",
    "email": "vlad@asd.com",
    "password": "1234",
    "role_id": 2,
    "is_active": 1
}

Response:
{
   "id": 5,
   "name": "tariq",
   "email": "vlad@asd.com",
   "password": "$2b$10$iTPRMkux7cSj5YaneZCAT.vMhfxbXH/9ARaYPZqvZDl4f589/gv.2",
   "is_active": true,
   "role_id": "2",
   "updatedAt": "2023-04-08T23:06:11.707Z",
   "createdAt": "2023-04-08T23:06:11.707Z"
}

DELETE /users/2

Headers:

Authorization: Bearer <access_token>

Response:
{
    "message": "User deleted successfully"
}

```
### Update Employee Information
```http
PUT /users/5

Headers:
Authorization: Bearer <access_token>
Content-Type: application/json

Body:
{
    "name":"test1"
}

Response:
{
   "id": 5,
   "name": "test1",
   "email": "vlad@asd.com",
   "phone_number": null,
   "password": "$2b$10$iTPRMkux7cSj5YaneZCAT.vMhfxbXH/9ARaYPZqvZDl4f589/gv.2",
   "role_id": 2,
   "is_active": true,
   "createdAt": "2023-04-08T23:06:11.000Z",
   "updatedAt": "2023-04-09T02:26:08.000Z"
}
```

### Employee Management

- HR managers can create, read, update, and delete employee data.
- Employees can only update their own information.

