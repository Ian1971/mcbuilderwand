import { Action } from "./action";
import { Sphere } from "./drawing/sphere";
import { Cuboid } from "./drawing/cuboid";
import { HollowCuboid } from "./drawing/hollow_cuboid";
export const cancel = new Action("cancel");
export const undo = new Action("undo");
const cuboidAction = new Cuboid();
const hollowCuboidAction = new HollowCuboid();
const pyramidAction = new Action("pyramid");
const sphereAction = new Sphere();
const hemisphereAction = new Action("hemisphere", false);
const coneAction = new Action("cone");
const lineAction = new Action("line");
const wallAction = new Action("wall", false);
const actions = new Array(cuboidAction, hollowCuboidAction, pyramidAction, sphereAction, hemisphereAction, coneAction, lineAction, wallAction, undo, cancel);
export const actionMap = new Map();
for (let i = 0; i < actions.length; i++) {
    actionMap.set(actions[i].name, i);
}
export class ActionList {
    static get actions() {
        return actions;
    }
}
