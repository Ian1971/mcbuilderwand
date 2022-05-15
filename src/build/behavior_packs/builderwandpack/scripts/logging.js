import { world } from "mojang-minecraft";
export function log(msg) {
    world.getDimension("overworld").runCommand(`say "${msg}"`);
}
