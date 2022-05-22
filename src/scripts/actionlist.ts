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
 
export const cancel:Action = new Action("cancel");
export const undo:Action = new Action("undo");
const cuboidAction:Action = new Cuboid();
const hollowCuboidAction:Action = new HollowCuboid();
const pyramidAction:Action = new Pyramid();
const sphereAction:Action = new Sphere();
const hemisphereAction:Action = new Hemisphere();
const cylinderAction:Action = new Cylinder();
const coneAction:Action = new Cone();
const lineAction:Action = new Line();
const wallAction:Action = new Wall();
const actions:Action[] = new Array<Action>(
  cuboidAction,
  hollowCuboidAction,
  pyramidAction,
  sphereAction,
  hemisphereAction,
  cylinderAction,
  coneAction,
  lineAction,
  wallAction,
  undo,
  cancel,
);

export const actionMap = new Map<string, number>();
for (let i = 0; i < actions.length; i++) {
  actionMap.set(actions[i].name, i);
}

export class ActionList {

  static get actions() : Action[]
  {
    return actions;
  }

}