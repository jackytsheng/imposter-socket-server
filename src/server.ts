import { Game } from './../utils/GameProperty';
import { mapGameSelectedToGame } from './../utils/mapper';
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
} from "../utils/users";
import {
  roomChangeGame,
  getAllUsersInRoom,
  changeAdmin,
  getRoomInfo,
} from "../utils/room";
// const path = require('path');

// app.use(express.static(path.join(__dirname, "public")));

const server = http.createServer(app);
const SERVER_USER= "Chat Bot";
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
    username: SERVER_USER,
    message: `${user.username} has joined the chat.`,
  });

  io.to(user.room).emit("userList", getAllUsersInRoom(user.room));
  io.to(user.room).emit("roomInfo", getRoomInfo(user.room));
};


io.on('connection',socket =>{
  
  socket.on('joinRoom', ({username,room})=>{
    newUserJoinAction(socket,username, room);
  })
  
  socket.on("chatMessage", (message) => {
    const currentUser = getCurrentUser(socket.id);
    io.to(currentUser.room).emit("message", { username:currentUser.username, message });
  });
  socket.on("gameSelection", ({room,game}) =>{
    let gameSelected:Game = mapGameSelectedToGame(game);
    roomChangeGame(gameSelected,room);
    socket.broadcast.to(room).emit("gameChange",game);
    let gameChangedMessage = game ? `game has been changed to ${game}` : "No game is selected"
    io.to(room).emit("message", {
      username: SERVER_USER,
      message: gameChangedMessage,
    });
  });
  socket.on("disconnect", () => {
    let user = getCurrentUser(socket.id);
    if (user) {
      deleteUser(socket.id,user.room);
      if(user.role === Role.Admin){
        let newAdmin:User = changeAdmin(user.room);
        io.to(user.room).emit("message", {
          username: SERVER_USER,
          message: `admin has been changed to ${newAdmin.username}`,
        });
        io.to(user.room).emit("userList", getAllUsersInRoom(user.room));
      }
      io.to(user.room).emit("message", {
        username: SERVER_USER,
        message: `${user.username} has left the chat.`,
      });

      io.to(user.room).emit(
        "userList",
        getAllUsersInRoom(user.room)
      ); 
      io.to(user.room).emit("roomInfo", getRoomInfo(user.room));
    }
  });
 
})

