import { Block, BlockLocation, BoolBlockProperty, Player, world } from "@minecraft/server";
import {above, vectorAToB, MapWithOffset, getWidthAndLengthWithAxis, push_to_map_axis} from "./vector";
import {Action, PlayerWandState} from "./../action"
import { pyramid } from "./hollow_cuboid";
import * as logging from "./../logging"

export class Pyramid extends Action {

    constructor()
    {
    super("pyramid", true, true, true);
    }
    
    execute(wandState: PlayerWandState):MapWithOffset | null 
    {
        const ab = vectorAToB(wandState.firstPosition, wandState.secondPosition);
        let widlen = getWidthAndLengthWithAxis(ab, wandState.direction);
    
        let map = pyramid(widlen.width, widlen.length, wandState.direction);

        return map;
    }

    message(wandState: PlayerWandState){
        logging.log(`You have chosen to create a pyramid using ${wandState.firstBlock.typeId}`);
        logging.log(`The first click is the center of the base of the pyramid.`);
        logging.log(`The second click is the half the width of the base and height of the pyramid.`);
    }
}

 