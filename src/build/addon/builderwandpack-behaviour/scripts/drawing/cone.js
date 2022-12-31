import { vectorAToB, getWidthAndLengthWithAxis } from "./vector";
import { Action } from "./../action";
import { cone_of_radius } from "./cylinder";
import * as logging from "./../logging";
export class Cone extends Action {
    constructor() {
        super("cone", true, true, true);
    }
    execute(wandState) {
        const ab = vectorAToB(wandState.firstPosition, wandState.secondPosition);
        let widlen = getWidthAndLengthWithAxis(ab, wandState.direction);
        let map = cone_of_radius(widlen.width, widlen.length, wandState.direction);
        return map;
    }
    message(wandState) {
        logging.log(`You have chosen to create a cone using ${wandState.firstBlock.typeId}`);
        logging.log(`The first click is the center of the base circle of the cone.`);
        logging.log(`The second click is the radius and height of the cone.`);
    }
}
