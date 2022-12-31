import { BlockLocation } from "@minecraft/server";
import { vectorAToB, MapWithOffset, getWidthAndLengthWithAxis, push_to_map_axis } from "./vector";
import { Action } from "./../action";
import * as logging from "./../logging";
export class HollowCuboid extends Action {
    constructor() {
        super("hollow cuboid", true, true, true);
    }
    execute(wandState) {
        const ab = vectorAToB(wandState.firstPosition, wandState.secondPosition);
        let widlen = getWidthAndLengthWithAxis(ab, wandState.direction);
        let map = cuboid_hollow(widlen.width, widlen.length, wandState.direction);
        return map;
    }
    message(wandState) {
        logging.log(`You have chosen to create a hollow cuboid using ${wandState.firstBlock.typeId}`);
        logging.log(`The first click is the center of the base of the cuboid.`);
        logging.log(`The second click is the half the width of the base and height of the cuboid.`);
    }
}
function cuboid_hollow(w, h, direction) {
    // return {map:cubeDraw(w,h,direction), offset:{x:0,y:0,z:0}};
    return cubeDraw(w, h, direction);
}
export function pyramid(w, h, direction) {
    return pyramidDraw(w, h, direction);
}
function cubeDraw(w, h, direction) {
    let map = new Array();
    let used = new Map();
    //if negative height then they went down. Remember that for later but flip sign of h
    let sign = 1;
    if (h < 0) {
        sign = -1;
        h = -h;
    }
    else if (h === 0) {
        h = 1; //min height = 1;
    }
    for (let y = 0; y < h; y++) {
        square(w, map, used, sign * y, direction);
    }
    return new MapWithOffset(map, new BlockLocation(0, 0, 0));
}
function pyramidDraw(w, h, direction) {
    let map = new Array();
    let used = new Map();
    //if negative height then they went down. Remember that for later but flip sign of h
    let sign = 1;
    if (h < 0) {
        sign = -1;
        h = -h;
    }
    else if (h === 0) {
        h = 1; //min height = 1;
    }
    const step = w / h; //how much to decrease radius by each iteration
    for (let y = 0; y < h; y++) {
        if (w <= 0)
            break;
        square(w, map, used, sign * y, direction);
        w -= step;
        ;
    }
    return new MapWithOffset(map, new BlockLocation(0, 0, 0));
    ;
}
//square centered on 0,0 of width w
function square(w, map, used, y, direction) {
    const x0 = Math.round(-w / 2);
    const z0 = Math.round(-w / 2);
    // const start = {x:Math.round(-w/2),y:y,z:Math.round(-w/2) };
    const x1 = Math.round(w / 2);
    const z1 = Math.round(w / 2);
    // const end = {x:Math.round(w/2),y:y,z:Math.round(w/2) };
    plotLine(x0, z0, x1, z0, map, used, y, direction);
    plotLine(x0, z0, x0, z1, map, used, y, direction);
    plotLine(x1, z0, x1, z1, map, used, y, direction);
    plotLine(x0, z1, x1, z1, map, used, y, direction);
}
//https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm
function plotLine(x0, z0, x1, z1, map, used, y, direction) {
    if (Math.abs(z1 - z0) < Math.abs(x1 - x0)) {
        if (x0 > x1)
            plotLineLow(x1, z1, x0, z0, map, used, y, direction);
        else
            plotLineLow(x0, z0, x1, z1, map, used, y, direction);
    }
    else {
        if (z0 > z1)
            plotLineHigh(x1, z1, x0, z0, map, used, y, direction);
        else
            plotLineHigh(x0, z0, x1, z1, map, used, y, direction);
    }
}
function plotLineLow(x0, z0, x1, z1, map, used, y, direction) {
    let dx = x1 - x0;
    let dz = z1 - z0;
    let zi = 1;
    if (dz < 0) {
        zi = -1;
        dz = -dz;
    }
    let D = (2 * dz) - dx;
    let z = z0;
    for (let x = x0; x <= x1; x++) {
        plot(x, z, map, used, y, direction);
        if (D > 0) {
            z = z + zi;
            D = D + (2 * (dz - dx));
        }
        else {
            D = D + 2 * dz;
        }
    }
}
function plotLineHigh(x0, z0, x1, z1, map, used, y, direction) {
    let dx = x1 - x0;
    let dz = z1 - z0;
    let xi = 1;
    if (dx < 0) {
        xi = -1;
        dx = -dx;
    }
    let D = (2 * dx) - dz;
    let x = x0;
    for (let z = z0; z <= z1; z++) {
        plot(x, z, map, used, y, direction);
        if (D > 0) {
            x = x + xi;
            D = D + (2 * (dx - dz));
        }
        else {
            D = D + 2 * dx;
        }
    }
}
function plot(x, z, map, used, y, direction) {
    //push_to_map(map,{x:Math.round(x), y:y, z:Math.round(z), col:1},used);
    let item = new BlockLocation(x, y, z);
    push_to_map_axis(map, item, used, direction);
}
