import { world } from "mojang-minecraft";

export function log(msg:string){
    world.getDimension("overworld").runCommand(`say "${msg}"`);
}