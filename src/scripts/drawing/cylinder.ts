import { Block, BlockLocation, BoolBlockProperty, Player, world } from "@minecraft/server";
import {above, vectorAToB, MapWithOffset, getWidthAndLengthWithAxis, push_to_map_axis} from "./vector";
import {Action, PlayerWandState} from "../action"
import * as logging from "../logging"

export class Cylinder extends Action {

    constructor()
    {
    super("cylinder", true, true, true);
    }
    
    execute(wandState: PlayerWandState):MapWithOffset | null 
    {
        const ab = vectorAToB(wandState.firstPosition, wandState.secondPosition);
        let widlen = getWidthAndLengthWithAxis(ab, wandState.direction);
    
        let map = cylinder_of_radius(widlen.width, widlen.length, wandState.direction);

        return map;
    }

    message(wandState: PlayerWandState){
        logging.log(`You have chosen to create a cylinder using ${wandState.firstBlock.typeId}`);
        logging.log(`The first click is the center of the base circle of the cylinder.`);
        logging.log(`The second click is the radius and height of the cylinder.`);
    }
}

function cylinder_of_radius(r:number, h:number, direction:string):MapWithOffset
{
    return new MapWithOffset(cylinder(r,h,direction), new BlockLocation(0,0,0));

}

export function cone_of_radius(r:number, h:number, direction:string):MapWithOffset
{
    return new MapWithOffset(cone(r,h,direction), new BlockLocation(0,0,0));

}

// //xz plane circle at height y
function circle(r:number, map:BlockLocation[], used:Map<string, boolean>, y:number, direction:string) {
    circleBres(r, map, used, y, direction) ;

}

function circleBres(r:number, map:BlockLocation[], used:Map<string, boolean>, y:number, direction:string) 
{ 
    let xc:number = 0, zc:number = 0;
    let x:number = 0, z:number = r; 
    let d:number = 3 - 2 * r; 
    drawCircle(xc, zc, x, z, map, used, y, direction); 
    while (z >= x) 
    { 
        // for each pixel we will 
        // draw all eight pixels 
          
        x++; 
  
        // check for decision parameter 
        // and correspondingly  
        // update d, x, y 
        if (d > 0) 
        { 
            z--;  
            d = d + 4 * (x - z) + 10; 
        } 
        else
            d = d + 4 * x + 6; 
        drawCircle(xc, zc, x, z, map, used, y, direction); 
    } 
} 

function drawCircle(xc:number, zc:number, x:number, z:number, map:BlockLocation[], used:Map<string, boolean>, y:number, direction:string) 
{ 
    push_to_map_axis(map, new BlockLocation(xc+x, y, zc+z), used, direction);
    push_to_map_axis(map, new BlockLocation(xc-x, y, zc+z), used, direction);
    push_to_map_axis(map, new BlockLocation(xc+x, y, zc-z), used, direction);
    push_to_map_axis(map, new BlockLocation(xc-x, y, zc-z), used, direction);

    push_to_map_axis(map, new BlockLocation(xc+z, y, zc+x), used, direction);
    push_to_map_axis(map, new BlockLocation(xc-z, y, zc+x), used, direction);
    push_to_map_axis(map, new BlockLocation(xc+z, y, zc-x), used, direction);
    push_to_map_axis(map, new BlockLocation(xc-z, y, zc-x), used, direction);

} 

function cylinder(r:number, h:number, direction:string) {
    let map = new Array<BlockLocation>();
    let used = new Map<string, boolean>();

    //TODO: could make more efficient by calcing the circle once and replicating
    //if negative height then they went down. Remember that for later but flip sign of h
    let sign = 1;
    if (h < 0) {
        sign = -1;
        h = -h;
    }
    else if (h === 0){
        h = 1; //min height = 1;
    }
    for (let y = 0; y < h; y++) {
        circle(r, map, used, sign * y, direction);
        
    }

    return map;
}

function cone(r:number, h:number, direction:string) {
    let map = new Array<BlockLocation>();
    let used = new Map<string, boolean>();

    //TODO: could make more efficient by calcing the circle once and replicating
    //if negative height then they went down. Remember that for lat.er but flip sign of h
    let sign:number = 1;
    if (h < 0) {
        sign = -1;
        h = -h;
    }
    else if (h === 0){
        h = 1; //min height = 1;
    }

    const coneStep:number = r / h ; //how much to decrease radius by each iteration

    for (let y:number = 0; y < h; y++) {
        if (r <= 0)
            break;
        circle(r, map, used, sign * y, direction);
        r -= coneStep;;
    }

    return map;
}
