import { Action } from "./action";
import { Sphere } from "./drawing/sphere";
import { Cuboid } from "./drawing/cuboid";
import { HollowCuboid } from "./drawing/hollow_cuboid";
import { Pyramid } from "./drawing/pyramid";
import { Hemisphere } from "./drawing/hemisphere";
import { Cylinder } from "./drawing/cylinder";
import { Cone } from "./drawing/cone";
import { Line } from "./drawing/line";
import { Wall } from "./drawing/wall";
export const cancel = new Action("cancel");
export const undo = new Action("undo");
const cuboidAction = new Cuboid();
const hollowCuboidAction = new HollowCuboid();
const pyramidAction = new Pyramid();
const sphereAction = new Sphere();
const hemisphereAction = new Hemisphere();
const cylinderAction = new Cylinder();
const coneAction = new Cone();
const lineAction = new Line();
const wallAction = new Wall();
const actions = new Array(cuboidAction, hollowCuboidAction, pyramidAction, sphereAction, hemisphereAction, cylinderAction, coneAction, lineAction, wallAction, undo, cancel);
export const actionMap = new Map();
for (let i = 0; i < actions.length; i++) {
    actionMap.set(actions[i].name, i);
}
export class ActionList {
    static get actions() {
        return actions;
    }
}
