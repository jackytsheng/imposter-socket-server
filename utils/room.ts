
import { Game, Role } from './GameProperty';
import { User } from './../interfaces/User';
import { Room, Seat } from '../interfaces/Room';
let rooms: Room[] = [];

const DEFAULT_SEAT_NUMBER:number = 10;
const chooseRoom = (roomId: number): Room =>
  rooms.find((room) => room.Id === roomId);

const userJoinRoom=(user:User,roomId:number)=>{
  let joinedRoom: Room = chooseRoom(roomId);
  if (joinedRoom) {
    joinedRoom.players.push(user);
    const nextAvailableSeatNumber = joinedRoom.availableSeat.shift();
    joinedRoom = playerSeatIn(user,joinedRoom,nextAvailableSeatNumber);
    updateRooms(joinedRoom)
  } else {
    let newRoom:Room = createRoom(roomId);
    newRoom = playerSeatIn(user,newRoom,1);
    rooms.push(newRoom);
  }
};
const updateRooms=(newRoom:Room):void=>{
  rooms = rooms.map(room => room.Id === newRoom.Id ? newRoom : room);
}
const playerSeatIn=(player:User,room:Room,seatNumber:number):Room=>{
  room.players.push(player);
  room.seatsList.push({player,seatNumber} as Seat);
  room.availableSeat =  room.availableSeat.filter(seatNo => seatNo !== seatNumber);
  return room;
}
const createRoom=(roomId:number):Room=>{
  let seatArray:number[] = Array(DEFAULT_SEAT_NUMBER).fill(0).map((e,i)=>i+1);
  return {
    Id: roomId,
    availableSeat: seatArray,
    totalSeatNumber: DEFAULT_SEAT_NUMBER,
    players: [],
    seatsList: [],
    gameInProgress:false,
  } as Room;

}
const isRoomInGame=(roomId:number):boolean => chooseRoom(roomId).gameInProgress

const roomChangeGame=(game:Game,roomId:number)=>{
  let selectedRoom: Room = chooseRoom(roomId);
  selectedRoom.game = game;
}

const changeAdmin=(roomId:number,toUserSeat:number = null):User=>{
  let selectedRoom: Room = chooseRoom(roomId);
  // TODO: Improve the logic
  if(toUserSeat){
    // both seat user and player list user point to the same object
    let admin:User;
    selectedRoom.seatsList.forEach((seat) => {
      if (seat.seatNumber === toUserSeat) {
        seat.player.role = Role.Admin;
        admin = seat.player;
      };
    })
    return admin
  }else if(selectedRoom && selectedRoom.players.length !== 0 ){
    // both seat user and player list user point to the same object
    let admin:User;
    
    selectedRoom.players[0].role = Role.Admin;
    admin = selectedRoom.players[0];
    return admin;
  }
}
const updateAvailableSeat=(room:Room,seatNumber:number):void=>{
  room.availableSeat.push(seatNumber)
  room.availableSeat.sort((a,b)=>a - b);
  console.log("Available Seat: ",room.availableSeat);
  room.seatsList = room.seatsList.filter(seat => seat.seatNumber !== seatNumber);
  updateRooms(room);
}
const userLeaveRoom = (userId:string, roomId: number) => {
  let leavedRoom: Room = chooseRoom(roomId);
  leavedRoom.players = leavedRoom.players.filter(user => user.id !== userId);
  let emptySeatNumber:number
  leavedRoom.seatsList.forEach(seat=> {
    if(seat.player.id === userId){
      emptySeatNumber = seat.seatNumber;
    }})
  updateAvailableSeat(leavedRoom, emptySeatNumber);
  console.log("Rooms List",rooms)
  if(chooseRoom(roomId).players.length === 0){
    deleteRoom(roomId);
  }
};

const deleteRoom=(roomId:number)=>{
  console.log("----------------")
  console.log("Deleting empty room")
  console.log("New rooms List", rooms);
  rooms = rooms.filter((room:Room)=>room.Id !==roomId);
}
const getRoomInfo = (roomId:number) : Room =>{
  return chooseRoom(roomId);
}
const getAllUsersInRoom = (roomId: number): User[] => {
  let selectedRoom:Room = rooms.find(room => room.Id === roomId );
  return selectedRoom ? selectedRoom.players : [];
};
const getSeatListsInRoom = (roomId:number): Seat[]=>{
  return chooseRoom(roomId).seatsList;
}

export {
  userJoinRoom,
  roomChangeGame,
  userLeaveRoom,
  getAllUsersInRoom,
  changeAdmin,
  getRoomInfo,
  isRoomInGame,
  getSeatListsInRoom,
};