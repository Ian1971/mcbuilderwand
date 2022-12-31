import { Action } from "./../action";
import * as logging from "./../logging";
import { wall } from "./line";
export class Wall extends Action {
    constructor() {
        super("wall", true, true, true);
    }
    execute(wandState) {
        let map = wall(wandState.firstPosition, wandState.secondPosition, wandState.direction);
        return map;
    }
    message(wandState) {
        logging.log(`You have chosen to create a wall using ${wandState.firstBlock.typeId}`);
        logging.log(`The first click is the start of the bottom wall.`);
        logging.log(`The second click is the end of the top of wall. (or vice-versa)`);
    }
}
