import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first"); 

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io"; 
import path from "path";

import connectDB from "./config/db.js";
import userroute from "./routes/user.route.js";
import chatroute from "./routes/chat.route.js";
import messageroute from "./routes/message.route.js";

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

app.use(cors()); 

app.use("/api/user", userroute);
app.use("/api/chat", chatroute);
app.use("/api/message", messageroute);


const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {

  app.use(express.static(path.join(__dirname1, "/client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "client", "dist", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is Running Successfully");
  });
}


const httpServer = createServer(app);

const PORT = process.env.PORT || 5000; 

const io = new Server(httpServer, {
  pingTimeout: 60000,
  cors: {
    origin: "*", 
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;
    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;
      socket.in(user._id).emit("message received", newMessageRecieved);
    });
  });

  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server started on PORT ${PORT}`);
});