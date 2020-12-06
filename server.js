import express from "express";
import mongoose from "mongoose";
import Cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { dbPassword } from "./private/dbPassword.js";
import * as userRequests from "./requests/userRequests.js";
import * as tableOverview from "./requests/tablesRequests.js";

// App config
const app = express();
const port = process.env.PORT || 8001;
const connection_url = `mongodb+srv://admin:${dbPassword}@cluster0.bdw2n.mongodb.net/TIC-TAC-TOE?retryWrites=true&w=majority`;

// Middleware
app.use(express.json());
app.use(Cors());
app.use(express.static("./node_modules"));

// DB config
mongoose.connect(connection_url, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

// Socket.io
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  const { room } = socket.handshake.query;
  socket.join(room);

  socket.on("tablesUpdated", (tables) => {
    io.to(room).emit("tablesUpdated", tables);
  });

  socket.on("disconnect", () => {
    socket.leave(room);
  });
});

httpServer.listen(port, () => {
  console.log("Server started on: " + port);
});

// API endpoints
app.get("/", (req, res) => {
  res.send("Server is up");
});

app.post("/register", userRequests.registerUser);
app.post("/login", userRequests.loginUser);
app.get("/topUsers", userRequests.getTop5Users);
app.post("/userRank", userRequests.getUserRank);

// TableOverview
// app.post("/addTable", tableOverview.addTable);
app.get("/getTables", tableOverview.getTables);
