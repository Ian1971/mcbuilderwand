import { world, BlockLocation } from "mojang-minecraft";
import { ActionFormData, ModalFormData } from "mojang-minecraft-ui";
import * as logging from "./logging";
import * as enums from "./enums";
import * as sphere from "./drawing/sphere";
import * as vector from "./drawing/vector";
import { Action } from "./action";
import { PlayerMessage, PlayerWandState } from "./playerwandstate";
//TODO: use other dimensions - currently just overworld
//TODO: give option of using current player position when click or the clicked block
const builderWanderId = "dabby:builder_wand";
const coolDown = 5; //ticks to wait before processing another input
let tickIndex = 0;
let lastActionTick = -1;
const playerWandStates = new Map();
const playerMessaging = new Map();
//undo buffer is a map from play to an array of blocks
const undoMap = new Map();
const cancel = new Action("cancel");
const undo = new Action("undo");
const cuboidAction = new Action("cuboid", false);
const hollowCuboidAction = new Action("hollow cuboid");
const pyramidAction = new Action("pyramid");
const sphereAction = new Action("sphere", false);
const hemisphereAction = new Action("hemisphere", false);
const coneAction = new Action("cone");
const lineAction = new Action("line");
const wallAction = new Action("wall", false);
const actions = [
    cuboidAction,
    hollowCuboidAction,
    pyramidAction,
    sphereAction,
    hemisphereAction,
    coneAction,
    lineAction,
    wallAction,
    undo,
    cancel,
];
const actionMap = new Map();
for (let i = 0; i < actions.length; i++) {
    actionMap.set(actions[i].name, i);
}
function mainTick() {
    tickIndex++;
    // if (tickIndex % 100 === 0) {
    //   world.getDimension("overworld").runCommand("say Hello starter1!");
    // }
    //check if we need to show a dialog to a user (used to handle multiple dialogs, because
    //for some reason it doesn't show a second dialog unless control returned
    playerMessaging.forEach((msg, key, map) => {
        logging.log("in player messaging");
        //handle the message
        if (msg) {
            //delete so we don't show it again
            map.delete(key);
            if (msg.dialog === enums.Dialog.OptionChoose) {
                //some action is chosen so show the options for it
                const optionForm = new ModalFormData()
                    .title("Options");
                if (msg.wandState.action.keepReplaceOpt) {
                    optionForm.toggle("Keep", false);
                }
                if (msg.wandState.action.blockOpt) {
                    optionForm.dropdown(`Block (selected = ${msg.wandState.firstBlock}`, ["selected", "air", "water", "lava"], 0);
                }
                if (msg.wandState.action.directionOpt) {
                    optionForm.dropdown(`Direction`, ["x", "y", "z"], 0);
                }
                optionForm.textField('test', 'val');
                // logging.log(`about to show optionForm`);
                optionForm.show(msg.player).then(optionResponse => {
                    msg.wandState.keep = optionResponse.formValues[0];
                    msg.wandState.blockOpt = optionResponse.formValues[1];
                    msg.wandState.direction = optionResponse.formValues[2];
                    playerWandStates.set(msg.player.name, msg.wandState);
                    //setup selected action
                    msg.wandState.action.message(msg.wandState);
                    if (msg.wandState.action === sphereAction) {
                        logging.log(`You have chosen to create a sphere using ${msg.wandState.firstBlock}`);
                        logging.log(`The first click choose the center.`);
                        logging.log(`The second click defines the radius.`);
                    }
                });
            }
        }
    });
}
function itemUseOn(args) {
    //this may be hit many times per click so ensure we handle it just once
    let tickSince = tickIndex - lastActionTick;
    if (lastActionTick > -1 && (tickSince < coolDown)) {
        // logging.log(`cooldown lastActionTick:${lastActionTick}, tickIndex:${tickIndex}`);
        return;
    }
    lastActionTick = tickIndex;
    logging.log(`itemUseOn ${args.item.id} lastActionTick:${lastActionTick}, tickIndex:${tickIndex}`);
    //some player has used the wand
    if (args.item.id === builderWanderId) {
        useWand(args);
    }
}
async function useWand(args) {
    // logging.log(`name ${args.source.nameTag}`);
    if (!playerWandStates.has(args.source.nameTag)) {
        logging.log(`No wandstate for ${args.source.nameTag}`);
        return;
    }
    let wandState = playerWandStates.get(args.source.nameTag) ?? new PlayerWandState();
    if (wandState.state === enums.WandState.Initial) {
        const clickedBlock = world.getDimension("overworld").getBlock(args.blockLocation);
        wandState.firstBlock = clickedBlock;
        wandState.state = enums.WandState.SelectedBlock;
        logging.log(`Selected block ${wandState.firstBlock} permuation:${JSON.stringify(wandState.firstBlock.permutation.getAllProperties())}`);
        const actionChooseForm = new ActionFormData()
            .title("Action")
            .body("What would you like to do?");
        for (let i = 0; i < actions.length; i++) {
            actionChooseForm.button(actions[i].name);
        }
        let showOptionForm = false;
        let player = args.source;
        let response = await actionChooseForm.show(player);
        if (response) {
            logging.log(`you chose ${response.selection}`);
            wandState.action = actions[response.selection];
            if (wandState.action === cancel) {
                transitionToInitial(player);
                return;
            }
            else if (wandState.action === undo) {
                //TODO: handle undo
                transitionToInitial(player);
                return;
            }
            else {
                showOptionForm = true;
            }
        }
        ;
        if (showOptionForm) {
            const message = new PlayerMessage(wandState, enums.Dialog.OptionChoose, player);
            playerMessaging.set(player.name, message);
            return;
        }
        //set block position
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
            let variant = 0;
            draw(map, args.source, variant, wandState);
            transitionToInitial(args.source);
        }
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
function draw(map, player, variant, wandState) {
    //create undo buffer for this action
    let thisUndo = new Array();
    undoMap.set(player.id, thisUndo);
    //let commands = new Array();
    map.map.forEach(element => {
        //log(element);
        //get coords of block
        const x = Math.floor(wandState.firstPosition.x + element.x - map.offset.x);
        const y = Math.floor(wandState.firstPosition.y + element.y - map.offset.y);
        const z = Math.floor(wandState.firstPosition.z + element.z - map.offset.z);
        const pos = new BlockLocation(x, y, z);
        //get the block and record it in the players undo
        let currentBlock = world.getDimension("overworld").getBlock(pos);
        let blockState = currentBlock.getComponent("minecraft:blockstate");
        thisUndo.push(new UndoItem(currentBlock, blockState));
        //TODO: get variant from wandState.block.permutation
        const replaceOrKeep = wandState.keep ? "keep" : "replace";
        const command = `setblock ${x} ${y} ${z} ${wandState.firstBlock.id} ${variant} ${replaceOrKeep}`;
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
