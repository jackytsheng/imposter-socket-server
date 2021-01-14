const express = require('express');
const app = express();
const http = require('http');
const socketio = require('socket.io');

// const path = require('path');

// app.use(express.static(path.join(__dirname, "public")));

const server = http.createServer(app);
const io = socketio(server,{
    cors: {
      origin: "*",
    }
  });



io.on('connection',socket =>{
  console.log("New connection is established");
  
  // receiving forward object
  socket.on('joinRoom', ({username,room})=>{

  
    socket.broadcast.emit("message", {
      username: "Chat Bot",
      message: `${username} has joined the chat`,
    });

    console.log("Socket ID", socket.id);
    console.log("Username", username);
    console.log("room", room);

    socket.on("chatMessage", (message) => {
      io.emit("message", { username, message })
    });
    socket.on("disconnect", () => {
      io.emit("message",
      {
        username: "Chat Bot",
        message: `${username} has left the chat`,
      });

    });
  })
 
  
  
  // console.log(socket);


  // broadcast to all other user about the connection

  // run when user disconnect
  
 
})

const PORT = 3010 || process.env.PORT;

server.listen(PORT, () => console.log("Service running on" , PORT)); 


