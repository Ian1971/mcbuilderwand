import { BlockLocation, Player } from "@minecraft/server";
import * as vector from "./vector";
import {Action, PlayerWandState} from "./../action"
import * as logging from "./../logging"
import { MapWithOffset} from "./vector";
import { hemisphere_of_radius } from "./sphere";

export class Hemisphere extends Action {

    constructor()
    {
    super("hemi-sphere", false, true, true);
    }
    
    execute(wandState: PlayerWandState):MapWithOffset | null 
    {
        const dir = vector.vectorAToB(wandState.firstPosition, wandState.secondPosition);
        const radius = Math.round(vector.magnitude(dir));
    
        let map = hemisphere_of_radius(radius);

        return map;
    }

    message(wandState: PlayerWandState){
        logging.log(`You have chosen to create a hemi-sphere using ${wandState.firstBlock}`);
        logging.log(`The first click choose the center.`);
        logging.log(`The second click defines the radius.`);
    }
}

 