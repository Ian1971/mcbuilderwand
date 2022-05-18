import * as logging from "./logging";
export class Action {
    constructor(name, directionOpt = true, keepReplaceOpt = true, blockOpt = true) {
        this.name = name;
        this.directionOpt = directionOpt;
        this.keepReplaceOpt = keepReplaceOpt;
        this.blockOpt = blockOpt;
    }
    message(wandState) {
        logging.log(`You have chosen to create a sphere using ${wandState.firstBlock}`);
        logging.log(`The first click choose the center.`);
        logging.log(`The second click defines the radius.`);
    }
}
