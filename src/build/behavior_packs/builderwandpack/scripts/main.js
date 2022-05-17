import { world, BlockLocation } from "mojang-minecraft";
import { ActionFormData } from "mojang-minecraft-ui";
import * as logging from "./logging";
import * as enums from "./enums";
import * as sphere from "./drawing/sphere";
import * as vector from "./drawing/vector";
//TODO: use other dimensions - currently just overworld
//TODO: give option of using current player position when click or the clicked block
const builderWanderId = "dabby:builder_wand";
const coolDown = 5; //ticks to wait before processing another input
let tickIndex = 0;
let lastActionTick = -1;
const playerWandStates = new Map();
//undo buffer is a map from play to an array of blocks
const undoMap = new Map();
const cancel = "cancel";
const undo = "undo";
const sphereAction = "sphere";
const actions = [
    "cuboid",
    "hollow cuboid",
    "pyramid",
    "sphere",
    "hemisphere",
    "cone",
    "line",
    "wall",
    undo,
    cancel,
];
const actionMap = new Map();
for (let i = 0; i < actions.length; i++) {
    actionMap.set(actions[i], i);
}
function mainTick() {
    tickIndex++;
    // if (tickIndex % 100 === 0) {
    //   world.getDimension("overworld").runCommand("say Hello starter1!");
    // }
}
function itemUseOn(args) {
    //this may be hit many times per click so ensure we handle it just once
    let tickSince = tickIndex - lastActionTick;
    if (lastActionTick > -1 && (tickSince < coolDown)) {
        return;
    }
    lastActionTick = tickIndex;
    logging.log(`itemUseOn ${args.item.id} lastActionTick:${lastActionTick}, tickIndex:${tickIndex}`);
    //some player has used the wand
    if (args.item.id === builderWanderId) {
        useWand(args);
    }
}
function useWand(args) {
    // logging.log(`name ${args.source.nameTag}`);
    if (!playerWandStates.has(args.source.nameTag)) {
        logging.log(`No wandstate for ${args.source.nameTag}`);
        return;
    }
    let wandState = playerWandStates.get(args.source.nameTag) ?? new PlayerWandState();
    if (wandState.state === enums.WandState.Initial) {
        const clickedBlock = world.getDimension("overworld").getBlock(args.blockLocation);
        wandState.firstBlock = clickedBlock.id;
        wandState.state = enums.WandState.SelectedBlock;
        logging.log(`Selected block ${wandState.firstBlock}`);
        const actionChooseForm = new ActionFormData()
            .title("Action")
            .body("What would you like to do?");
        for (let i = 0; i < actions.length; i++) {
            actionChooseForm.button(actions[i]);
        }
        actionChooseForm.show(args.source).then((response) => {
            world.getDimension("overworld").runCommand(`say you chose ${response.selection}`);
            wandState.actionIndex = response.selection;
            if (actions[wandState.actionIndex] === cancel) {
                transitionToInitial(args.source);
                return;
            }
            else if (actions[wandState.actionIndex] === undo) {
                //TODO: handle undo
                transitionToInitial(args.source);
                return;
            }
            else if (actions[wandState.actionIndex] === sphereAction) {
                logging.log(`You have chosen to create a sphere using ${wandState.firstBlock}`);
                logging.log(`The first click choose the center.`);
                logging.log(`The second click defines the radius.`);
                return;
            }
        });
        if (wandState.state === enums.WandState.SelectedBlock) {
            wandState.firstPosition = args.blockLocation;
            wandState.state = enums.WandState.SelectedFirstPosition;
            logging.log(`SelectedFirstPosition ${wandState.firstPosition}`);
        }
        else if (wandState.state === enums.WandState.SelectedFirstPosition) {
            wandState.secondPosition = args.blockLocation;
            wandState.state = enums.WandState.SelectedSecondPosition;
            logging.log(`SelectedSecondPosition ${wandState.secondPosition}`);
            logging.log(`GO ${JSON.stringify(wandState)}`);
            //TODO: UI
            const dir = vector.vectorAToB(wandState.firstPosition, wandState.secondPosition);
            const radius = Math.round(vector.magnitude(dir));
            let map = sphere.sphere_of_radius(radius);
            let replaceOrKeep = "replace";
            let variant = 0;
            draw(map, wandState.firstBlock, wandState.firstPosition, args.source, replaceOrKeep, variant);
            transitionToInitial(args.source);
        }
        //   const form = new ModalFormData()
        //   .title("Action")
        //   .dropdown("What would you like to do?", 
        //   ["cuboid",
        //   "hollowCuboid",
        //   "pyramid",
        //   "Sphere",
        //   "hemisphere",
        //   "cone",
        //   "line",
        //   "wall",
        //   "undo last action"],
        //   3)
        //   ;
        // form.show(<Player>args.source).then((response) => {
        //     world.getDimension("overworld").runCommand(`say you chose ${response.formValues![0]}`);
        // });
        // logging.log(`Selected block ${args.item.id}`);
        // if (playerWandStates[args.source.nameTag])
    }
}
function playerJoin(args) {
    playerWandStates.set(args.player.name, new PlayerWandState());
}
function playerLeave(args) {
    playerWandStates.delete(args.playerName);
}
//changes wand state back to initial
function transitionToInitial(entity) {
    let wandState = new PlayerWandState();
    playerWandStates.set(entity.nameTag, wandState);
}
world.events.tick.subscribe(mainTick);
world.events.playerJoin.subscribe(playerJoin);
world.events.playerLeave.subscribe(playerLeave);
world.events.itemUseOn.subscribe(itemUseOn);
world.events.beforeItemUseOn;
class PlayerWandState {
    constructor() {
        this.state = enums.WandState.Initial;
        this.firstBlock = "";
        this.firstPosition = new BlockLocation(0, 0, 0);
        this.secondPosition = new BlockLocation(0, 0, 0);
        this.actionIndex = actionMap.get(cancel);
    }
}
function draw(map, blockName, startPos, player, replaceOrKeep, variant) {
    //create undo buffer for this action
    let thisUndo = new Array();
    undoMap.set(player.id, thisUndo);
    //let commands = new Array();
    map.map.forEach(element => {
        //log(element);
        //get coords of block
        const x = Math.floor(startPos.x + element.x - map.offset.x);
        const y = Math.floor(startPos.y + element.y - map.offset.y);
        const z = Math.floor(startPos.z + element.z - map.offset.z);
        const pos = new BlockLocation(x, y, z);
        //get the block and record it in the players undo
        let currentBlock = world.getDimension("overworld").getBlock(pos);
        let blockState = currentBlock.getComponent("minecraft:blockstate");
        thisUndo.push(new UndoItem(currentBlock, blockState));
        const command = `setblock ${x} ${y} ${z} ${blockName} ${variant} ${replaceOrKeep}`;
        try {
            logging.log(`inside map array command:${command} `);
            let response = world.getDimension("overworld").runCommand(command);
        }
        catch (error) {
            //ignore errors for now
            logging.log(`error:${JSON.stringify(error)}`);
        }
    });
}
class UndoItem {
    constructor(block, blockState) {
        this.block = block;
        this.blockState = blockState;
    }
}
