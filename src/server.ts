import { Message } from './../interfaces/Message';
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
  isRoomInGame,
} from "../utils/room";
import { Room } from '../interfaces/Room';
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

const userEnterRoom = (id: string, username: string, room: number): User =>{
  
  return isRoomEmpty(room)
    ? userJoin(id, username, room, Role.Admin)
    : userJoin(id, username, room);
}

const generateRoomWithGameID=(roomId:number,game:Game):string=>roomId +"_"+ game;

const newUserJoinAction = (socket, username: string, room: number) => {
  
  let user = userEnterRoom(socket.id, cap(username), room);
  
  socket.join(user.room);

  socket.broadcast.to(user.room).emit("message",botSay(`${user.username} has joined the chat.`));
  io.to(user.room).emit("userList", getAllUsersInRoom(user.room));
  io.to(user.room).emit("roomInfo", getRoomInfo(user.room));
};

const startGame=(game:Game)=>{

}

const botSay=(msg:string):Message=>{
  return {
    username:SERVER_USER,
    message:msg
  }
}
io.on('connection',socket =>{
  socket.on('joinRoom', ({username,room})=>{
    newUserJoinAction(socket,username, room);
  })

 
  socket.on("gameStart", ({ room, game }) => {
    
    socket.leave(room);
    let roomWithGame = generateRoomWithGameID(room,game);
    socket.join(roomWithGame);
    console.log("game starts on ",roomWithGame);
    io.to(roomWithGame).emit("message",botSay(`Game has started. Game: ${game}, Number of players: ${getRoomInfo(room).seatsList.length}`));
  });
  socket.on("gameMessage", (message)=>{
    const currentUser: User = getCurrentUser(socket.id);
    const roomInfo: Room = getRoomInfo(currentUser.room);
    let roomWithGame = generateRoomWithGameID(roomInfo.Id, roomInfo.game);
    io.to(roomInfo.Id).to(roomWithGame).emit("message",{username:currentUser.username,message})
  })
  socket.on("chatMessage", (message) => {
    const currentUser:User = getCurrentUser(socket.id);
    io.to(currentUser.room).emit("message", { username: currentUser.username, message });
  });

  socket.on("gameSelection", ({room,game}) =>{
    let gameSelected:Game = mapGameSelectedToGame(game);
    roomChangeGame(gameSelected,room);
    socket.broadcast.to(room).emit("gameChange",game);
    let gameChangedMessage = game ? `game has been changed to ${game}` : "No game is selected"
    io.to(room).emit("message",botSay(gameChangedMessage));
  });

  socket.on("disconnect", () => {
    let user = getCurrentUser(socket.id);
    if (user) {
      deleteUser(socket.id,user.room);
      if(user.role === Role.Admin){
        let newAdmin:User = changeAdmin(user.room);
        io.to(user.room).emit("message",botSay(`admin has been changed to ${newAdmin.username}`));
        io.to(user.room).emit("userList", getAllUsersInRoom(user.room));
      }
      io.to(user.room).emit("message",botSay(`${user.username} has left the chat.`));
      io.to(user.room).emit(
        "userList",
        getAllUsersInRoom(user.room)
      ); 
      io.to(user.room).emit("roomInfo", getRoomInfo(user.room));
    }
  });
 
})

