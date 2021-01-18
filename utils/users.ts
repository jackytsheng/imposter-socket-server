import { Role } from './GameProperty';
import { User } from './../interfaces/User';
import { userJoinRoom, roomChangeGame, userLeaveRoom } from '../utils/room';

let users: User[] = [];

const userJoin = (
  id: string,
  username: string,
  room: number,
  role: Role = Role.Player): User => {
  const user: User = { id, username, room, role } as User;

  console.log("A user has joined room");
  console.log("Socket ID", id);
  console.log("Username", username);
  console.log("room", room);
  console.log("role", role);
  console.log("--------------------");
  
  userJoinRoom(user, room);
  users.push(user);
  return user;
};
const getCurrentUser=(id:string):User=>{
  return users.find((user: User) => user.id === id);
}

const deleteUser = (id: string,roomId:number): void => {
  users = users.filter((user: User) => user.id !== id);
  userLeaveRoom(id,roomId);
};


export {
  userJoin,
  getCurrentUser,
  deleteUser,
}