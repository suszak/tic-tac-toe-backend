import express from "express";
import mongoose from "mongoose";
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
    origin: "https://pai-tic-tac-toe.herokuapp.com/",
    methods: ["GET", "POST", "PUT"],
  },
});

io.on("connection", (socket) => {
  clients[socket.id] = socket;

  const { room } = socket.handshake.query;
  socket.join(room);

  socket.on("tablesUpdated", (data) => {
    io.to(room).emit("tablesUpdated", data);
  });

  // game table section
  socket.on("joinGame", (data) => {
    socket.join(data.room);
    socket.to(data.room).emit("userJoined");
  });

  socket.on("newTurn", (data) => {
    io.to(data.room).emit("newTurn", {
      gameTable: data.gameTable,
      newTurn: data.turn,
    });
  });

  socket.on("gameEnded", (data) => {
    const newData = calculatePoints(data);
    axiosUpdatePoints(data.winner, newData.newWinnerPoints).then((response) => {
      if (response.data.updated) {
        io.to("tables").emit("tableChanged");
      }
    });
    axiosUpdateTablesPoints(data.winner, newData.newWinnerPoints).then(
      (response) => {
        if (response.data.updated) {
          io.to("tables").emit("tableChanged");
        }
      }
    );
    axiosUpdatePoints(data.loser, newData.newLoserPoints).then((response) => {
      if (response.data.updated) {
        io.to("tables").emit("tableChanged");
      }
    });
    axiosUpdateTablesPoints(data.loser, newData.newLoserPoints).then(
      (response) => {
        if (response.data.updated) {
          io.to("tables").emit("tableChanged");
        }
      }
    );
  });

  socket.on("leaveTable", (data) => {
    axiosDisconnectUserFromDB(clients[socket.id].handshake.headers.login).then(
      (response) => {
        if (response.data.updated) {
          io.to("tables").emit("userDisconnected");
        }
      }
    );

    socket.leave(data.room);
  });

  socket.on("logout", () => {
    socket.disconnect();
  });

  socket.on("disconnect", () => {
    axiosDisconnectUserFromDB(clients[socket.id].handshake.headers.login).then(
      (response) => {
        if (response.data.updated) {
          io.to("tables").emit("userDisconnected");
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
app.get("/", (req, res) => {
  res.send("Server is up");
});

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
