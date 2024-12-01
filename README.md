
# Multi-Database Query API

This project provides an Express-based REST API for executing queries on multiple databases (MySQL, PostgreSQL, SQLite, and MongoDB) dynamically. It allows users to specify the database type, database name, and query via query parameters.

## Features

- Supports **MySQL**, **PostgreSQL**, **SQLite**, and **MongoDB**.
- Allows dynamic database switching.
- Handles both SQL and MongoDB queries.
- Middleware for JSON and URL-encoded payloads.

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/baguswijaksono/dapi.git
   cd dapi
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up your database connections**:
   - Update database credentials in the code if needed:
     - MySQL: Username, password, and host.
     - PostgreSQL: Username, password, and host.
     - MongoDB: Connection URL (default is `mongodb://localhost:27017`).

4. **Run the application**:
   ```bash
   node app.js
   ```

5. **API is available at**: `http://localhost:3001`.

## Usage

### Endpoint

#### `GET /query`

Executes a query on the specified database.

**Query Parameters**:
- `db`: The name of the database to use.
- `sql`: The query string to execute.
- `dbType`: The type of database (`mysql`, `postgres`, `sqlite`, or `mongodb`).

### Example Requests

#### MySQL
```bash
curl "http://localhost:3001/query?db=mydb&sql=SELECT%20*%20FROM%20users&dbType=mysql"
```

#### PostgreSQL
```bash
curl "http://localhost:3001/query?db=mydb&sql=SELECT%20*%20FROM%20users&dbType=postgres"
```

#### SQLite
```bash
curl "http://localhost:3001/query?db=mydb&sql=SELECT%20*%20FROM%20users&dbType=sqlite"
```

#### MongoDB
```bash
curl "http://localhost:3001/query?db=mydb&sql=db.collection('users').find({}).toArray()&dbType=mongodb"
```

### Response

- **Success**: Returns the query results.
  ```json
  {
    "results": [
      { "id": 1, "name": "John Doe" },
      { "id": 2, "name": "Jane Doe" }
    ]
  }
  ```

- **Error**: Returns an error message.
  ```json
  {
    "error": "Query execution failed",
    "details": "Error details here"
  }
  ```

## Dependencies

- **Express**: Web server framework.
- **MySQL**: MySQL client library.
- **pg**: PostgreSQL client library.
- **sqlite3**: SQLite client library.
- **mongoose**: MongoDB client library.

## Development

### Add New Database Support
1. Install the required database client library.
2. Add a case for the new database type in the `/query` endpoint.

### Run in Development Mode
```bash
npm run dev
```

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

Feel free to contribute or open issues for feature requests and bug fixes!
