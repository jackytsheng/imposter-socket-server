import { Role } from './GameProperty';
import { User } from './../interfaces/User';
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

  users.push(user);
  return user;
};
const getCurrentUser=(id:string):User=>{
  return users.find((user: User) => user.id === id);
}

const deleteUser = (id: string): void => {
  users = users.filter((user: User) => user.id !== id);
};

const getAllUsersInRoom=(room:number):User[]=>{
  return users.filter(user => user.room === room);
}
export {
  userJoin,
  getCurrentUser,
  deleteUser,
  getAllUsersInRoom,
}