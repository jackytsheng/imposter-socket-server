import { Role } from './../utils/GameProperty';
export interface User {
  id: string;
  room: number;
  username: string;
  role: Role;
}
