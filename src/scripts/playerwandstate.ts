import * as enums from "./enums"
import { Block, BlockLocation, Player } from "mojang-minecraft";
import {Action} from "./action"
import {Dialog} from "./enums"

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
    state: enums.WandState;
    firstBlock: Block;
    firstPosition: BlockLocation;
    secondPosition: BlockLocation;
    action: Action;
    keep: boolean;
    blockOpt: number;
    direction: number;
  
  
    constructor() {
      this.state = enums.WandState.Initial;
      this.firstBlock = null!;
      this.firstPosition = new BlockLocation(0,0,0);
      this.secondPosition = new BlockLocation(0,0,0);
      this.action = null!;
      this.keep = false;
      this.blockOpt = 0;
      this.direction = 0;
    }
  }