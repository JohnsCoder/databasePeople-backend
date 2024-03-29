const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const fs = require("fs");
require("dotenv/config");

let db = mysql.createConnection(process.env.DATABASE_URL);

function handleDisconnect(localDb) {
  localDb.on("error", function (err) {
    console.log("Re-connecting lost connection");
    db.destroy();
    db = mysql.createConnection(process.env.DATABASE_URL);
    handleDisconnect(db);
    db.connect(function (err) {
      s;
      if (err) console.log("error connecting:" + err.stack);
    });
  });
}
handleDisconnect(db);

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  optionsSuccessStatus: 200,
  allowedHeaders: "*",
};

app.use(express.json());
app.use(cors(corsOptions));

app.get("/users", ({}, res) => {
  db.query(
    "SELECT id, first_name, last_name, email, salary FROM users ORDER BY first_name ASC",
    (err, result) => {
      if (err) throw err.message;
      res.send(result);
    }
  );
});

app.post("/newUsers", (req, res) => {
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
      if (err) throw err.message;
      res.send(result);
    }
  );
});

app.delete("/delUsers/:id", (req, res) => {
  db.query("DELETE FROM users WHERE id = ?", [req.params.id], (err, result) => {
    if (err) throw err.message;
    res.send(result);
  });
});

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
      if (err) throw err.message;
      console.log(req.body);
      res.send(result);
    }
  );
});

app.listen(process.env.PORT || 8000, () =>
  console.log("Your Application is running")
);
