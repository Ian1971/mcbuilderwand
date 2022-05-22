import { Block, BlockLocation } from "mojang-minecraft";
import {MapWithOffset, push_to_map_axis} from "./vector";
import {Action, PlayerWandState} from "./../action"
import * as logging from "./../logging"
import { wall } from "./line";

export class Wall extends Action {

    constructor()
    {
    super("wall", true, true, true);
    }
    
    execute(wandState: PlayerWandState):MapWithOffset | null 
    {
        let map = wall(wandState.firstPosition, wandState.secondPosition, wandState.direction);
        return map;
    }

    message(wandState: PlayerWandState){
        logging.log(`You have chosen to create a wall using ${wandState.firstBlock.id}`);
        logging.log(`The first click is the start of the bottom wall.`);
        logging.log(`The second click is the end of the top of wall. (or vice-versa)`);
    }
}

