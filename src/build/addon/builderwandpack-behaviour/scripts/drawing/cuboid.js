import { BlockLocation } from "mojang-minecraft";
import { Action } from "./../action";
import * as logging from "./../logging";
import { MapWithOffset, push_to_map } from "./vector";
export class Cuboid extends Action {
    constructor() {
        super("cuboid", false, true, true);
    }
    execute(wandState) {
        var map = fillMap(wandState.firstPosition, wandState.secondPosition);
        return map;
    }
    message(wandState) {
        logging.log(`You have chosen to create a filled cuboid using ${wandState.firstBlock.id}`);
        logging.log(`The first click one corner of the cuboid.`);
        logging.log(`The second click is the opposite corner of the cuboid.`);
    }
}
function fillMap(from, to) {
    let map = new Array();
    let used = new Map();
    let minX = Math.min(from.x, to.x);
    let maxX = Math.max(from.x, to.x);
    let minY = Math.min(from.y, to.y);
    let maxY = Math.max(from.y, to.y);
    let minZ = Math.min(from.z, to.z);
    let maxZ = Math.max(from.z, to.z);
    for (let i = minX; i <= maxX; i++) {
        for (let j = minY; j <= maxY; j++) {
            for (let k = minZ; k <= maxZ; k++) {
                push_to_map(map, new BlockLocation(i, j, k), used);
            }
        }
    }
    return new MapWithOffset(map, new BlockLocation(from.x, from.y, from.z));
}
