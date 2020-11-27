import express from "express";
import mongoose from "mongoose";
import Cors from "cors";
import User from "./models/dbUser.js";
import { dbPassword } from "./private/dbPassword";

// App config
const app = express();
const port = process.env.PORT || 8001;
const connection_url = `mongodb+srv://admin:${dbPassword}@cluster0.bdw2n.mongodb.net/TIC-TAC-TOE?retryWrites=true&w=majority`;

// Middleware
app.use(express.json());
app.use(Cors());

// DB config
mongoose.connect(connection_url, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

// API endpoints
app.get("/", (req, res) => {
  res.status(200).send("hello world");
});

app.post("/users", (req, res) => {
  const dbUser = req.body;

  User.create(dbUser, (error, data) => {
    if (error) {
      response.status(500).send(error);
    } else {
      res.status(201).send(data);
    }
  });
});

app.get("/users", (req, res) => {
  User.find((error, data) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
});

// Listener
app.listen(port, () => {
  console.log(`listening on localhost: ${port}`);
});

// DbkC78tfxmrNoE5m
