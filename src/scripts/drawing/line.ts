import { Block, BlockLocation } from "@minecraft/server";
import {MapWithOffset, push_to_map_axis} from "./vector";
import {Action, PlayerWandState} from "./../action"
import * as logging from "./../logging"

export class Line extends Action {

    constructor()
    {
    super("line", false, true, true);
    }
    
    execute(wandState: PlayerWandState):MapWithOffset | null 
    {
        let map = line3D(wandState.firstPosition, wandState.secondPosition);
        return map
    }

    message(wandState: PlayerWandState){
        logging.log(`You have chosen to create a line using ${wandState.firstBlock.typeId}`);
        logging.log(`The first click is the start of the line.`);
        logging.log(`The second click is the end of the line.`);
    }
}

// /https://www.geeksforgeeks.org/bresenhams-algorithm-for-3-d-line-drawing/

//wall between two points where the direction axis is fixed for the line
export function wall(startPos:BlockLocation, endPos:BlockLocation, direction:string):MapWithOffset {
    let map = new Array();
    let used = new Map<string, boolean>();

    let h = Math.floor(endPos.y) - Math.floor(startPos.y);
    let sign = 1;
    if (h < 0) {
        sign = -1;
        h = -h;
    }
    else if (h === 0){
        h = 1; //min height = 1;
    }
    for (let y = 0; y < h; y++) {
        doline3D(startPos.x, sign * y, startPos.z, endPos.x, sign * y, endPos.z, direction, map, used);
    }

    return new MapWithOffset(map, new BlockLocation(startPos.x,0,startPos.z));

}

//line between two points in 3d
function line3D(startPos:BlockLocation, endPos:BlockLocation):MapWithOffset {
    let map = new Array<BlockLocation>();
    let used = new Map<string, boolean>();

    doline3D(startPos.x, startPos.y, startPos.z, endPos.x, endPos.y, endPos.z, "y", map, used);

    return new MapWithOffset(map, new BlockLocation(startPos.x,startPos.y,startPos.z));
}

function doline3D(x1:number, y1:number, z1:number, x2:number, y2:number, z2:number, direction:string, map:BlockLocation[], used:Map<string, boolean>):MapWithOffset {
    x1 = Math.floor(x1);
    y1 = Math.floor(y1);
    z1 = Math.floor(z1);
    x2 = Math.floor(x2);
    y2 = Math.floor(y2);
    z2 = Math.floor(z2);

    push_to_map_axis(map, new BlockLocation(x1, y1, z1), used, direction);
    let dx:number = Math.abs(x2 - x1) ;
    let dy:number = Math.abs(y2 - y1) ;
    let dz:number = Math.abs(z2 - z1) ;
    let xs:number,ys:number,zs:number;

    if (x2 > x1)
        xs = 1;
    else
        xs = -1;

    if (y2 > y1)
        ys = 1;
    else
        ys = -1;

    if (z2 > z1)
        zs = 1;
    else
        zs = -1;

    //Driving axis is X-axis
    if (dx >= dy && dx >= dz){
        let p1:number = 2 * dy - dx ;
        let p2:number = 2 * dz - dx ;
        while (x1 != x2) {
            x1 += xs ;
            if (p1 >= 0) {
                y1 += ys ;
                p1 -= 2 * dx ;
            }

            if (p2 >= 0){
                z1 += zs ;
                p2 -= 2 * dx;
            }
 
            p1 += 2 * dy ;
            p2 += 2 * dz ;
            push_to_map_axis(map, new BlockLocation(x1, y1, z1), used, direction);
        } 

    }      
    //Driving axis is Y-axis
    else if (dy >= dx && dy >= dz){
        let p1:number = 2 * dx - dy ;
        let p2:number = 2 * dz - dy ;
        while (y1 != y2) {
            y1 += ys ;
            if (p1 >= 0) {
                x1 += xs ;
                p1 -= 2 * dy ;
            }

            if (p2 >= 0) {
                z1 += zs ;
                p2 -= 2 * dy ;
            }

            p1 += 2 * dx ;
            p2 += 2 * dz ;
            push_to_map_axis(map, new BlockLocation(x1, y1, z1), used, direction);
        }

    }       
    //Driving axis is Z-axis
    else {
        let p1:number = 2 * dy - dz ;
        let p2:number = 2 * dx - dz ;
        while (z1 != z2) {
            z1 += zs ;
            if (p1 >= 0){
                y1 += ys ;
                p1 -= 2 * dz ;
            }

            if (p2 >= 0){
                x1 += xs ;
                p2 -= 2 * dz ;
            }

            p1 += 2 * dy ;
            p2 += 2 * dx ;
            push_to_map_axis(map, new BlockLocation(x1, y1, z1), used, direction);
        }

    }      
       
    return new MapWithOffset(map, new BlockLocation(0,0,0));
}
