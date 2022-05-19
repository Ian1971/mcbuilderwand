import * as logging from "./logging";
import { MapWithOffset } from "./drawing/vector";
import { Sphere } from "./drawing/sphere";
import { BlockLocation } from "mojang-minecraft";
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
export const cancel = new Action("cancel");
export const undo = new Action("undo");
const cuboidAction = new Action("cuboid", false);
const hollowCuboidAction = new Action("hollow cuboid");
const pyramidAction = new Action("pyramid");
const sphereAction = new Sphere();
const hemisphereAction = new Action("hemisphere", false);
const coneAction = new Action("cone");
const lineAction = new Action("line");
const wallAction = new Action("wall", false);
export const actions = [
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
];
export const actionMap = new Map();
for (let i = 0; i < actions.length; i++) {
    actionMap.set(actions[i].name, i);
}
