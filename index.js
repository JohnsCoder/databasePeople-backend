const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const fs = require("fs");
require("dotenv/config");

let db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.DATABASE_PASSWORD,
  database: "js_data",
});

db.connect();

app.use(express.json());
app.use(cors());

app.get("/getUsers", ({}, res) => {
  db.query(
    "SELECT id, first_name, last_name, email, salary FROM users ORDER BY first_name ASC",
    (err, result) => {
      if (err) throw err;
      res.send(result);
    }
  );
});

app.post("/postUsers", (req, res) => {
  db.query(
    "INSERT INTO users ( first_name, last_name, email, salary, password_hash) VALUES ( ?, ?, ?, ?, ? )",
    [
      req.body.first_name,
      req.body.last_name,
      req.body.email,
      req.body.salary,
      req.body.password_hash,
    ],
    (err, result) => {
      if (err) throw err;
      res.send(result);
    }
  );
});

app.delete("/delUsers/:id", (req, res) => {
  db.query("DELETE FROM users WHERE id = ?",[req.params.id],
  (err, result ) => {
    if(err) throw err;
   res.send(result) 
  }
  )
})

app.put("/editUsers", (req, res) => {
  db.query(
    "UPDATE users SET first_name = ?, last_name = ?, email = ?, salary = ? WHERE id = ?",
    [
      req.body.first_name,
      req.body.last_name,
      req.body.email,
      req.body.salary,
      req.body.id,
    ],
    (err, result) => {
      if (err) throw err;
      console.log(req.body)
      res.send(result);
    }
  );
});

app.listen(3001, () => {
  console.log({
    get: "http://localhost:3001/getUsers",
    post: "http://localhost:3001/postUsers",
    put: "http://localhost:3001/editUsers",
    delete: "http://localhost:3001/delUsers"
  });
});
