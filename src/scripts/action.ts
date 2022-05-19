import * as logging from "./logging";
import {PlayerWandState} from "./playerwandstate"
import { MapWithOffset } from "./drawing/vector";
import {Sphere} from "./drawing/sphere"
import { BlockLocation } from "mojang-minecraft";

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
  
    execute(wandState: PlayerWandState) : MapWithOffset
    {
      logging.log(`Should not get here. Need a concrete action`);
      return new MapWithOffset([], new BlockLocation(0,0,0));
    }

    /** This is shown after the player has selected options, before they choose locations. */
    message(wandState: PlayerWandState){
      logging.log(`Should not get here. Need a concrete action`);
    }
  }


  
export const cancel:Action = new Action("cancel");
export const undo:Action = new Action("undo");
const cuboidAction:Action = new Action("cuboid", false);
const hollowCuboidAction:Action = new Action("hollow cuboid");
const pyramidAction:Action = new Action("pyramid");
const sphereAction:Action = new Sphere();
const hemisphereAction:Action = new Action("hemisphere", false);
const coneAction:Action = new Action("cone");
const lineAction:Action = new Action("line");
const wallAction:Action = new Action("wall", false);
export const actions:Action[] = [
  cuboidAction,
  hollowCuboidAction,
  pyramidAction,
  sphereAction,
  hemisphereAction,
  coneAction,
  lineAction,
  wallAction,
  undo,
  cancel,
]

export const actionMap = new Map<string, number>();
for (let i = 0; i < actions.length; i++) {
  actionMap.set(actions[i].name, i);
}
