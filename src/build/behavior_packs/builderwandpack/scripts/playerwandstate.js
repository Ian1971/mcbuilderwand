import * as enums from "./enums";
import { BlockLocation } from "mojang-minecraft";
export class PlayerMessage {
    constructor(wandState, dialog, player) {
        this.wandState = wandState;
        this.dialog = dialog;
        this.player = player;
    }
}
export class PlayerWandState {
    constructor() {
        this.state = enums.WandState.Initial;
        this.firstBlock = null;
        this.firstPosition = new BlockLocation(0, 0, 0);
        this.secondPosition = new BlockLocation(0, 0, 0);
        this.action = null;
        this.keep = false;
        this.blockOpt = 0;
        this.direction = 0;
    }
}
