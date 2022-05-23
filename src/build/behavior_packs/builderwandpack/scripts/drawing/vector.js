import { BlockLocation } from "mojang-minecraft";
export function vectorAToB(startPos, endPos) {
    return new BlockLocation(endPos.x - startPos.x, endPos.y - startPos.y, endPos.z - startPos.z);
}
export function magnitude(vector) {
    return Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z);
}
function magnitude2d(x, y) {
    return Math.sqrt(x * x + y * y);
}
export function push_to_map(map, item, used) {
    //check we don't already have it
    const posid = item.x + "|" + item.y + "|" + item.z;
    if (used.get(posid)) {
        return;
    }
    used.set(posid, true);
    map.push(item);
}
export class MapWithOffset {
    constructor(map, offset) {
        this.map = map;
        this.offset = offset;
    }
}
export function push_to_map_axis(map, item, used, axis) {
    if (axis === "x") {
        var mapLocation = new BlockLocation(item.y, Math.round(item.x), Math.round(item.z));
        push_to_map(map, mapLocation, used);
    }
    else if (axis === "z") {
        var mapLocation = new BlockLocation(Math.round(item.x), Math.round(item.z), -item.y);
        push_to_map(map, mapLocation, used);
    }
    else {
        var mapLocation = new BlockLocation(Math.round(item.x), item.y, Math.round(item.z));
        push_to_map(map, mapLocation, used);
    }
}
export function above(above, y) {
    return above ? y + 1 : y;
}
export function getWidthAndLengthWithAxis(vector, axis) {
    let width;
    let length = vector.y;
    if (axis === "x") {
        width = 2 * magnitude2d(vector.y, vector.z);
        length = vector.x;
    }
    else if (axis === "z") {
        width = 2 * magnitude2d(vector.y, vector.x);
        length = vector.x;
    }
    else {
        width = 2 * magnitude2d(vector.x, vector.z);
    }
    return { width: width, length: length };
}
