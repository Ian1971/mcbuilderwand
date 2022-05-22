import { Action } from "./action";
import { Sphere } from "./drawing/sphere";
import { Cuboid } from "./drawing/cuboid";
import { HollowCuboid } from "./drawing/hollow_cuboid";
import { Pyramid } from "./drawing/pyramid";

 
export const cancel:Action = new Action("cancel");
export const undo:Action = new Action("undo");
const cuboidAction:Action = new Cuboid();
const hollowCuboidAction:Action = new HollowCuboid();
const pyramidAction:Action = new Pyramid();
const sphereAction:Action = new Sphere();
const hemisphereAction:Action = new Action("hemisphere", false);
const coneAction:Action = new Action("cone");
const lineAction:Action = new Action("line");
const wallAction:Action = new Action("wall", false);
const actions:Action[] = new Array<Action>(
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