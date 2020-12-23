import express from "express";
import mongoose from "mongoose";
import path from "path";
import Cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { dbPassword } from "./private/dbPassword.js";
import * as userRequests from "./requests/userRequests.js";
import * as tableOverview from "./requests/tablesRequests.js";
import {
  axiosDisconnectUserFromDB,
  axiosUpdatePoints,
  axiosUpdateTablesPoints,
} from "./axios.js";
import { calculatePoints } from "./helpers/calculatePoints.js";

// App config
const app = express();
const port = process.env.PORT || 8002;
const connection_url = `mongodb+srv://admin:${dbPassword}@cluster0.bdw2n.mongodb.net/TIC-TAC-TOE?retryWrites=true&w=majority`;
// app.use(express.static(path.join(path.resolve(), 'build')));

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
let clients = {};
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    // origin: "https://pai-tic-tac-toe.herokuapp.com/",
    methods: ["GET", "POST", "PUT"],
  },
});

io.on("connection", (socket) => {
  clients[socket.id] = socket;

  socket.on("tablesUpdate", (data) => {
    io.emit("tablesUpdated", data);
  });

  // game table section
  socket.on("joinGame", (data) => {
    socket.broadcast.emit("userJoined", data);
  });

  socket.on("newTurnInc", (data) => {
    socket.broadcast.emit("newTurn", {
      gameTable: data.gameTable,
      newTurn: data.turn,
      room: data.room,
    });
  });

  socket.on("gameEnded", (data) => {
    const newData = calculatePoints(data);

    Promise.all([
      axiosUpdatePoints(data.winner, newData.newWinnerPoints),
      axiosUpdateTablesPoints(data.winner, newData.newWinnerPoints),
      axiosUpdatePoints(data.loser, newData.newLoserPoints),
      axiosUpdateTablesPoints(data.loser, newData.newLoserPoints),
    ]).then((responses) => {
      io.emit("tablesRefreshed");
    });
  });

  socket.on("wannaPlayAgain", (data) => {
    socket.broadcast.emit("playAgain", data);
  });

  socket.on("leaveTable", () => {
    axiosDisconnectUserFromDB(clients[socket.id].handshake.headers.login).then(
      (response) => {
        if (response.data.updated) {
          io.emit("tablesRefreshed");
        }
      }
    );
  });

  socket.on("logout", () => {
    socket.disconnect();
  });

  socket.on("disconnect", () => {
    axiosDisconnectUserFromDB(clients[socket.id].handshake.headers.login).then(
      (response) => {
        if (response.data.updated) {
          io.emit("tablesRefreshed");
        }
      }
    );

    delete clients[socket.id];

    socket.rooms.forEach((el) => {
      socket.leave(el);
    });
  });
});

httpServer.listen(port, () => {
  console.log("Server started on: " + port);
});

// API endpoints
// app.get('/', (req, res) => {
//   res.sendFile(path.join(path.resolve(), 'build', 'index.html'))
// })

// User
app.post("/register", userRequests.registerUser);
app.post("/login", userRequests.loginUser);
app.get("/topUsers", userRequests.getTop5Users);
app.post("/userRank", userRequests.getUserRank);
app.post("/getAdminStatus", userRequests.getAdminStatus);
app.get("/getUsers", userRequests.getUsers);
app.put("/changeAdminStatus", userRequests.changeAdminStatus);
app.put("/changePassword", userRequests.changePassword);
app.put("/deleteUser", userRequests.deleteUser);
app.put("/updatePoints", userRequests.updatePoints);

// TableOverview
// app.post("/addTable", tableOverview.addTable);
app.get("/getTables", tableOverview.getTables);
app.put("/updateTables", tableOverview.updateTables);
app.put("/disconnectUser", tableOverview.disconnectUserFromTable);
app.put("/updateTablesPoints", tableOverview.updateTablesPoints);
