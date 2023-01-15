const express = require('express');
require('dotenv').config({path:'./config/.env'});
require('./config/db');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const chatRoutes = require('./routes/chat.routes');
const messageRoutes = require('./routes/message.routes');

const app = express();

//jwt
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//cookie parser
app.use(cookieParser());

// routes
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

const server = app.listen(process.env.PORT, ()=>{
    console.log(`listen on port ${process.env.PORT}`);
})

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
      origin: "http://localhost:3000",
      // credentials: true,
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
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
  
    socket.on("new message", (newMessageRecieved) => {
      var chat = newMessageRecieved.chat;
  
      if (!chat.users) return console.log("chat.users not defined");
  
      chat.users.forEach((user) => {
        if (user._id == newMessageRecieved.sender._id) return;
  
        socket.in(user._id).emit("message recieved", newMessageRecieved);
      });
    });
  
    socket.off("setup", () => {
      console.log("USER DISCONNECTED");
      socket.leave(userData._id);
    });
  });
  