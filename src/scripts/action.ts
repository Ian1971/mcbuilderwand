import * as logging from "./logging";
import { MapWithOffset } from "./drawing/vector";
import { Block, BlockLocation, Player }from "mojang-minecraft";
import {Dialog, WandState} from "./enums"

export class PlayerMessage{
  wandState: PlayerWandState;
  dialog: Dialog;
  player: Player;

  constructor(wandState: PlayerWandState, dialog: Dialog, player: Player) {
    this.wandState = wandState;
    this.dialog = dialog;
    this.player = player;
  }
}
export class PlayerWandState {
    state: WandState;
    firstBlock: Block;
    firstPosition: BlockLocation;
    secondPosition: BlockLocation;
    action: Action;
    keep: boolean;
    blockOpt: number;
    direction: number;
    above: boolean;
  
  
    constructor() {
      this.state = WandState.Initial;
      this.firstBlock = null!;
      this.firstPosition = new BlockLocation(0,0,0);
      this.secondPosition = new BlockLocation(0,0,0);
      this.action = null!;
      this.keep = false;
      this.blockOpt = 0;
      this.direction = 0;
      this.above = false;
    }

    get replaceOrKeep():string{
      const replaceOrKeep = this.keep ? "keep" : "replace";
      return replaceOrKeep;
    }
  }

export class Action {
    name: string;
    directionOpt: boolean;
    keepReplaceOpt: boolean;
    blockOpt: boolean;
  
    constructor(name: string, directionOpt: boolean = true, keepReplaceOpt: boolean = true, blockOpt: boolean = true){
      this.name = name;
      this.directionOpt = directionOpt;
      this.keepReplaceOpt = keepReplaceOpt;
      this.blockOpt = blockOpt;
    }
  
    execute(wandState: PlayerWandState) : MapWithOffset | null 
    {
      logging.log(`Should not get here. Need a concrete action`);
      return new MapWithOffset([], new BlockLocation(0,0,0));
    }

    /** This is shown after the player has selected options, before they choose locations. */
    message(wandState: PlayerWandState){
      logging.log(`Should not get here. Need a concrete action`);
    }
  }


 