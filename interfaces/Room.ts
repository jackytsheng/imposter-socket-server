import { Game } from './../utils/GameProperty';
import { User } from './User';

export interface Room{
  Id:number;
  players: User[];
  game:Game;
  totalSeatNumber:number;
  seatsList:Seat[];
  availableSeat:number[],
}

export interface Seat{
  player : User;
  seatNumber: number;
}