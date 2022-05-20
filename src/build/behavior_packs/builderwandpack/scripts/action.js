import * as logging from "./logging";
import { MapWithOffset } from "./drawing/vector";
import { BlockLocation } from "mojang-minecraft";
import { WandState } from "./enums";
export class PlayerMessage {
    constructor(wandState, dialog, player) {
        this.wandState = wandState;
        this.dialog = dialog;
        this.player = player;
    }
}
export class PlayerWandState {
    constructor() {
        this.state = WandState.Initial;
        this.firstBlock = null;
        this.firstPosition = new BlockLocation(0, 0, 0);
        this.secondPosition = new BlockLocation(0, 0, 0);
        this.action = null;
        this.keep = false;
        this.blockOpt = 0;
        this.direction = "x";
        this.above = false;
    }
    get replaceOrKeep() {
        const replaceOrKeep = this.keep ? "keep" : "replace";
        return replaceOrKeep;
    }
}
export class Action {
    constructor(name, directionOpt = true, keepReplaceOpt = true, blockOpt = true) {
        this.name = name;
        this.directionOpt = directionOpt;
        this.keepReplaceOpt = keepReplaceOpt;
        this.blockOpt = blockOpt;
    }
    execute(wandState) {
        logging.log(`Should not get here. Need a concrete action`);
        return new MapWithOffset([], new BlockLocation(0, 0, 0));
    }
    /** This is shown after the player has selected options, before they choose locations. */
    message(wandState) {
        logging.log(`Should not get here. Need a concrete action`);
    }
}
