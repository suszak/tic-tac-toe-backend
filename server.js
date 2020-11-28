import express from "express";
import mongoose from "mongoose";
import Cors from "cors";
import User from "./models/dbUser.js";
import { dbPassword } from "./private/dbPassword.js";
import * as userRequests from "./requests/userRequests.js";

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
  res.status(200).send("I'm up");
});

app.post("/register", userRequests.registerUser);
app.post("/login", userRequests.loginUser);

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
  console.log("Server started!");
});
