import { world } from "@minecraft/server";
export function log(msg) {
    world.getDimension("overworld").runCommandAsync(`say "${msg}"`);
}
