import { Game, Role } from './GameProperty';
import { User } from './../interfaces/User';
import { Room } from '../interfaces/Room';
let rooms: Room[] = [];


const chooseRoom = (roomId: number): Room =>
  rooms.find((room) => room.Id === roomId);

const userJoinRoom=(user:User,roomId:number)=>{
  let joinedRoom: Room = chooseRoom(roomId);
  if (joinedRoom) {
    joinedRoom.players.push(user);
  } else {
    rooms.push({Id:roomId, players:[user],game:Game.None} as Room)
  }
};
const roomChangeGame=(game:Game,roomId:number)=>{
  let selectedRoom: Room = chooseRoom(roomId);
  selectedRoom.game = game;
}

const changeAdmin=(roomId:number,toUserSeat:number = null,)=>{
  let selectedRoom: Room = chooseRoom(roomId);
  // TODO: Improve the logic
  if(toUserSeat){
    selectedRoom.players[toUserSeat].role = Role.Admin;
  }else if(selectedRoom.players.length !== 0 ){
    selectedRoom.players[0].role = Role.Admin;
  }
}
const userLeaveRoom = (userId:string, roomId: number) => {
  let leavedRoom: Room = chooseRoom(roomId);
  leavedRoom.players = leavedRoom.players.filter(user => user.id !== userId);
};
const getAllUsersInRoom = (roomId: number): User[] => {
  let selectedRoom:Room = rooms.find(room => room.Id === roomId );
  return selectedRoom ? selectedRoom.players : [];
};

export {
  userJoinRoom,
  roomChangeGame,
  userLeaveRoom,
  getAllUsersInRoom,
  changeAdmin,
};