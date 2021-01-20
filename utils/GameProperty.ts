import { GameSetting } from './../interfaces/GameSetting';
export enum Role{
  Admin="admin",
  Player="player",
}
export enum Game {
  Imposter = "imposter",
  Mafia = "mafia",
  Avalon = "avalon",
  None = "none",
}

export const DEFAULT_IMPOSTER_SETTING:GameSetting = 
  {
    badGuyNumber:1,
    turnDuration:0,
  }


  export enum Language {
    ENG = "English",
    CHN = "Chinese",
  }

  export enum ImposterMode {
    Blank = "Blank",
    DualWord = "DualWord",
  }

