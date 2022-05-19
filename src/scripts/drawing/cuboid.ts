import { BlockLocation, Player, world } from "mojang-minecraft";
import {above} from "./vector";
import {Action, PlayerWandState} from "./../action"
import * as logging from "./../logging"
import { MapWithOffset} from "./vector";

export class Cuboid extends Action {

    constructor()
    {
    super("cuboid", false, true, true);
    }
    
    execute(wandState: PlayerWandState):MapWithOffset | null 
    {
        //TODO: variants for fill
        const command = "fill " + Math.floor(wandState.firstPosition.x) + " " + Math.floor(above(wandState.above, wandState.firstPosition.y)) + " " + Math.floor(wandState.firstPosition.z) + " " + Math.floor(wandState.secondPosition.x) + " " + Math.floor(above(wandState.above, wandState.secondPosition.y)) + " " + Math.floor(wandState.secondPosition.z) + " " + wandState.firstBlock.id + " 0 " + wandState.replaceOrKeep;
        world.getDimension("overworld").runCommand(command);
        return null;
    }

    message(wandState: PlayerWandState){
        logging.log(`You have chosen to create a filled cuboid using ${wandState.firstBlock.id}`);
        logging.log(`The first click one corner of the cuboid.`);
        logging.log(`The second click is the opposite corner of the cuboid.`);
        logging.log(`Warning: There is NO undo for this action.`);
    }
}