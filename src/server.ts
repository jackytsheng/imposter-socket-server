import { User } from './../interfaces/User';
const express = require('express');
const app = express();
const http = require('http');
const socketio = require('socket.io');
import { Role } from '../utils/GameProperty';
import {cap} from '../utils/textTool';
import {
  userJoin,
  getCurrentUser,
  deleteUser,
  getAllUsersInRoom,
} from "../utils/users";
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


const isRoomEmpty=(room: number) :boolean =>  {
  console.log("checking if the room is empty")
  return getAllUsersInRoom(room).length === 0};

const userEnterRoom = (id: string, username: string, room: number): User =>
  isRoomEmpty(room)
    ? userJoin(id, username, room, Role.Admin)
    : userJoin(id, username, room); 


const newUserJoinAction = (socket, username: string, room: number) => {
  
  let user = userEnterRoom(socket.id, cap(username), room);

  socket.join(user.room);

  socket.broadcast.to(user.room).emit("message", {
    username: "Chat Bot",
    message: `${user.username} has joined the chat.`,
  });

  io.to(user.room).emit("userList", getAllUsersInRoom(user.room));
};
  
io.on('connection',socket =>{
  
  socket.on('joinRoom', ({username,room})=>{
    newUserJoinAction(socket,username, room);
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

      io.to(userInRoom.room).emit(
        "userList",
        getAllUsersInRoom(userInRoom.room)
      ); 
    }
  });
 
})

