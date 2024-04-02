# Todo API Server Documentation

This documentation provides an overview of the Todo server, including its endpoints and usage instructions, as well as details about the underlying database.

## Table of Contents

- [Introduction](#introduction)
- [Getting Started](#getting-started)
- [Endpoints](#endpoints)
  - [Get All Todos (API)](#get-all-todos-api)
  - [Get All Todos (Database)](#get-all-todos-database)
  - [Get Todos by User ID](#get-todos-by-user-id)
  - [Add Todo (Database)](#add-todo-database)
  - [Update Todo (Database)](#update-todo-database)
  - [Delete Todo (Database)](#delete-todo-database)
  - [Search Todos (Database)](#search-todos-database)
  - [API Search](#api-search)

## Introduction

The Todo server is a Node.js application built using Express.js framework. It provides endpoints for managing todo items stored in a PostgreSQL database. The supports operations such as creating, reading, updating, and deleting todo items.

## Database

The Todo server utilizes a PostgreSQL database to store todo items. The database schema includes a `todos` table with columns for `tid` (todo ID), `todo` (description of the todo item), `completed` (status of completion), and `userId` (user ID associated with the todo item). The server interacts with the database using the `pg` PostgreSQL client for Node.js.

## Getting Started

To set up the Todo server locally, follow these steps:

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Set up a PostgreSQL database and configure the connection URL in a `.env` file.
4. Run the server using `npm start`.

## Endpoints

### Get All Todos (API)

- **URL:** `/`
- **Method:** `GET`
- **Description:** Retrieves a paginated list of todo items from an external API.
- **Query Parameters:**
  - `page`: (Optional) Specifies the page number for pagination.
- **Response:** Returns a JSON array of todo items.

### Get All Todos (Database)

- **URL:** `/getalltodos`
- **Method:** `GET`
- **Description:** Retrieves all todo items from the database or filters them based on completion status.
- **Query Parameters:**
  - `completed`: (Optional) Specifies whether to filter completed or incomplete todo items.
- **Response:** Returns a JSON array of todo items.

### Get Todos by User ID

- **URL:** `/getidtodo`
- **Method:** `GET`
- **Description:** Retrieves todo items based on user ID.
- **Query Parameters:**
  - `userId`: Specifies the user ID for filtering todo items.
- **Response:** Returns a JSON array of filtered todo items.

### Add Todo (Database)

- **URL:** `/addtodo`
- **Method:** `POST`
- **Description:** Creates a new todo item.
- **Request Body:** JSON object with `todo`, `completed`, and `userId` fields.
- **Response:** Returns the created todo item as JSON.

### Update Todo (Database)

- **URL:** `/updatetodo/:id`
- **Method:** `PATCH`
- **Description:** Updates a todo item.
- **Path Parameter:**
  - `id`: Specifies the ID of the todo item to update.
- **Request Body:** JSON object with `todo` and `completed` fields.
- **Response:** Returns a success message if the todo item was updated successfully.

### Delete Todo (Database)

- **URL:** `/deletetodo/:id`
- **Method:** `DELETE`
- **Description:** Deletes a todo item.
- **Path Parameter:**
  - `id`: Specifies the ID of the todo item to delete.
- **Response:** Returns a success message if the todo item was deleted successfully.

### Search Todos Database

- **URL:** `/searchtodos/:keyword`
- **Method:** `GET`
- **Description:** Searches for todo items containing the specified keyword.
- **Path Parameter:**
  - `keyword`: Specifies the keyword to search for in todo items.
- **Response:** Returns a JSON array of matching todo items.

### API Search

- **Description**: Search todos based on a keyword.
- **API**: Yes
- **Database**: No
- **Endpoint**: `/api/todos/apisearch`
- **Query Parameters**:
  - `todo`: The keyword to search for in todo text.
- **Response**: Returns a list of todos matching the provided keyword.

## Dependencies

- `express`: Web framework for Node.js
- `cors`: Middleware for enabling Cross-Origin Resource Sharing
- `axios`: Promise-based HTTP client for making requests
- `body-parser`: Middleware for parsing request bodies
- `dotenv`: Module for loading environment variables from a `.env` file
- `pg`: PostgreSQL client for Node.js

## Author

**This Todo server was developed by Abdalrhamn Aboalsoud.**

## License

This project is licensed under the [MIT License](LICENSE).
