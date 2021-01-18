import { Game } from './GameProperty';
export const mapGameSelectedToGame=(game:string):Game=>{
  switch(game){
    case "imposter":
      return Game.Imposter;
    case "avalon":
      return Game.Avalon;
    case "mafia":
      return Game.Mafia;
    default:
      return Game.None;
  }
}