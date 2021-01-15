const express = require('express');
const app = express();
const http = require('http');
const socketio = require('socket.io');
import {cap} from '../utils/textTool';
import {userJoin,getCurrentUser,deleteUser} from '../utils/users';
// const path = require('path');

// app.use(express.static(path.join(__dirname, "public")));

const server = http.createServer(app);

const PORT = 3010 || process.env.PORT;

server.listen(PORT, () => console.log("Service running on", PORT)); 


const io = socketio(server,{
    cors: {
      origin: "*",
    }
  });

io.on('connection',socket =>{
  console.log("New connection is established.");
  
  // receiving forward object
  socket.on('joinRoom', ({username,room})=>{
    let user = userJoin(socket.id,cap(username),room);

    socket.join(user.room);

    socket.broadcast.to(user.room).emit("message", {
      username: "Chat Bot",
      message: `${user.username} has joined the chat.`,
    });    
  })
  
  socket.on("chatMessage", (message) => {
    const currentUser = getCurrentUser(socket.id);
    io.to(currentUser.room).emit("message", { username:currentUser.username, message });
  });


  socket.on("disconnect", () => {
    let userInRoom = getCurrentUser(socket.id);
    if (userInRoom) {
      deleteUser(socket.id);
      io.to(userInRoom.room).emit("message", {
        username: "Chat Bot",
        message: `${userInRoom.username} has left the chat.`,
      });
    }
  });
 
})

