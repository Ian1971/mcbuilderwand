import { world } from "@minecraft/server";

export function log(msg:string){
    world.getDimension("overworld").runCommandAsync(`say "${msg}"`);
}