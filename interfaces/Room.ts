import { Game } from './../utils/GameProperty';
import { User } from './User';

export interface Room{
  Id:number;
  players: User[];
  game:Game;
}