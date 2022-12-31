import { vectorAToB, getWidthAndLengthWithAxis } from "./vector";
import { Action } from "./../action";
import { pyramid } from "./hollow_cuboid";
import * as logging from "./../logging";
export class Pyramid extends Action {
    constructor() {
        super("pyramid", true, true, true);
    }
    execute(wandState) {
        const ab = vectorAToB(wandState.firstPosition, wandState.secondPosition);
        let widlen = getWidthAndLengthWithAxis(ab, wandState.direction);
        let map = pyramid(widlen.width, widlen.length, wandState.direction);
        return map;
    }
    message(wandState) {
        logging.log(`You have chosen to create a pyramid using ${wandState.firstBlock.typeId}`);
        logging.log(`The first click is the center of the base of the pyramid.`);
        logging.log(`The second click is the half the width of the base and height of the pyramid.`);
    }
}
