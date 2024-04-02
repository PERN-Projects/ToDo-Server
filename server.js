const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios");
const bodyParser = require("body-parser");
require("dotenv").config();
const { Client } = require("pg");
const url = process.env.DATABASE_URL;
const client = new Client(url);
const port = process.env.PORT;

//middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
// api todos
app.get("/", (req, res) => {
  const url = "https://dummyjson.com/todos";
  const defaultPage = 1;
  const defaultLimit = 10;
  const page = parseInt(req.query.page) || defaultPage;
  axios
    .get(url)
    .then((result) => {
      let response = result.data.todos;
      const startIndex = (page - 1) * defaultLimit;
      const endIndex = startIndex + defaultLimit;
      const resultPage = response.slice(startIndex, endIndex);
      console.log(" result Page = " + resultPage.length);
      res.json(resultPage);
    })
    .catch((error) => {
      res.status(500).send("Internal Server Error");
    });
});

// get all todos from api based on specific id
app.get("/getidtodo", (req, res) => {
  const userId = req.query.userId;
  axios
    .get(`https://dummyjson.com/todos`)
    .then((response) => {
      // Filter todos based on userId
      const filteredTodos = response.data.todos.filter(
        (todo) => todo.userId == userId
      );
      console.log("Filtered Todos:", filteredTodos);
      res.json(filteredTodos); // Send filtered todos array
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    });
});

// create a todo

app.post("/addtodo", addTodoHandler);
function addTodoHandler(req, res) {
  const { todo, completed, userId } = req.body;
  const sql =
    "INSERT INTO todos (todo, completed, userId) VALUES ($1, $2, $3) RETURNING *";
  const values = [todo, completed];
  client
    .query(sql, values)
    .then((result) => {
      console.log(result.rows[0]);
      res.status(201).json(result.rows);
    })
    .catch((err) => {
      console.error(err.stack);
    });
}

// get all todos

app.get("/getalltodos", getAllTodosHandler);
function getAllTodosHandler(req, res) {
  const { completed } = req.query;
  if (completed === "true") {
    const sql = "SELECT * FROM todos WHERE completed = true";
    client
      .query(sql)
      .then((result) => {
        res.json(result.rows);
      })
      .catch((err) => {
        console.error(err.stack);
      });
  } else if (completed === "false") {
    const sql = "SELECT * FROM todos WHERE completed = false";
    client
      .query(sql)
      .then((result) => {
        res.json(result.rows);
      })
      .catch((err) => {
        console.error(err.stack);
      });
  } else {
    const sql = "SELECT * FROM todos";
    client
      .query(sql)
      .then((result) => {
        res.json(result.rows);
      })
      .catch((err) => {
        console.error(err.stack);
      });
  }
}

// get  todo
app.get("/spesfictodo/:id", getSpecificTodoHandler);
function getSpecificTodoHandler(req, res) {
  const { id } = req.params;
  const sql = `SELECT * FROM todos WHERE tid = $1`;
  const values = [id];
  console.log(req.params);
  client
    .query(sql, values)
    .then((result) => {
      res.json(result.rows);
    })
    .catch((err) => {
      console.error(err.stack);
    });
}

// update todo
app.patch("/updatetodo/:id", updateTodoHandler);
function updateTodoHandler(req, res) {
  const { id } = req.params;
  const { todo, completed } = req.body;
  const sql = `UPDATE todos SET todo = $1, completed = $2 WHERE  tid = $3 RETURNING *`;
  const values = [todo, completed, id];
  client
    .query(sql, values)
    .then((result) => {
      if (result.rowCount === 0) {
        return res.status(404).json({ message: "Todo not found" });
      }
      res.status(200).json({ message: "Todo updated successfully" });
    })
    .catch((err) => {
      console.error(err.stack);
      res.status(500).json({ message: "Internal server error" });
    });
}
// delete todo
app.delete("/deletetodo/:id", deleteTodoHandler);
function deleteTodoHandler(req, res) {
  const { id } = req.params;
  const sql = `DELETE FROM todos WHERE tid = $1 RETURNING *`;
  const values = [id];
  client
    .query(sql, values)
    .then((result) => {
      res.json({ message: "successfuly deleted" });
    })
    .catch((err) => {
      console.error(err.stack);
    });
}
// search todo database
app.get("/searchtodos/:keyword", searchTodosHandler);
function searchTodosHandler(req, res) {
  const { keyword } = req.params;
  const sql = `SELECT * FROM todos WHERE todo ILIKE $1`;
  const values = [`%${keyword}%`]; // Use ILIKE for case-insensitive search

  client
    .query(sql, values)
    .then((result) => {
      console.log(keyword);
      res.status(200).json(result.rows);
    })
    .catch((err) => {
      console.error(err.stack);
      res.status(500).json({ message: "Internal server error" });
    });
}

app.get("/apisearch", (req, res) => {
  const keyword = req.query.todo;
  const url = `https://dummyjson.com/todos?todo=${keyword}`;
  
  axios.get(url)
    .then(response => {
      // console.log(response.data.todos);
      let filteredTodos = response.data.todos.filter((todo) => {
        return todo.todo.toLowerCase().includes(keyword.toLowerCase().trim());
        // todo.todo.trim() === keyword.trim();
      })
      // console.log(keyword);
      res.json(filteredTodos);
    })
    .catch(error => {
      console.error(error.stack);
      res.status(500).json({ message: "Internal server error" });
    });
});

client
  .connect()
  .then(() => {
    app.listen(port, () => {
      console.log(`my app is running and  listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error(err.stack);
  });
