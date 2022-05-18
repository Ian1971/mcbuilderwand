import * as logging from "./logging";
import {PlayerWandState} from "./playerwandstate"

export class Action {
    name: string;
    directionOpt: boolean;
    keepReplaceOpt: boolean;
    blockOpt: boolean;
  
    constructor(name: string, directionOpt: boolean = true, keepReplaceOpt: boolean = true, blockOpt: boolean = true){
      this.name = name;
      this.directionOpt = directionOpt;
      this.keepReplaceOpt = keepReplaceOpt;
      this.blockOpt = blockOpt;
    }
  
    message(wandState: PlayerWandState){
        logging.log(`You have chosen to create a sphere using ${wandState.firstBlock}`);
        logging.log(`The first click choose the center.`);
        logging.log(`The second click defines the radius.`);
    }
  }