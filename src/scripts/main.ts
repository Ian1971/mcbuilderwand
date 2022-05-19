import { world, Block, ItemStack, Entity, ItemUseEvent, BlockBreakEvent, PlayerJoinEvent, PlayerLeaveEvent, ItemUseOnEvent, BlockLocation, Player } from "mojang-minecraft";
import {MessageFormData, ActionFormData, ModalFormData} from "mojang-minecraft-ui"
import * as logging from "./logging";
import * as enums from "./enums"
import { MapWithOffset } from "./drawing/vector";
import { PlayerMessage, PlayerWandState } from "./action"
import { ActionList, cancel, undo } from "./actionlist";

//TODO: use other dimensions - currently just overworld
//TODO: give option of using current player position when click or the clicked block

const builderWanderId:string = "dabby:builder_wand";
const coolDown:number = 5; //ticks to wait before processing another input
let tickIndex:number = 0;
let lastActionTick:number = -1;
const playerWandStates = new Map<string, PlayerWandState>();
const playerMessaging = new Map<string, PlayerMessage>();
//undo buffer is a map from play to an array of blocks
const undoMap = new Map<string, Array<UndoItem>>();

function mainTick() {
  tickIndex++;

  if (tickIndex % 10 === 0) {
    world.getDimension("overworld").runCommand("say Hello starter1!");
  }

  //check if we need to show a dialog to a user (used to handle multiple dialogs, because
  //for some reason it doesn't show a second dialog unless control returned
  playerMessaging.forEach( (msg, key, map) => {
    logging.log("in player messaging");
    //handle the message
    if (msg){
      //delete so we don't show it again
      map.delete(key);
  
      if (msg.dialog === enums.Dialog.OptionChoose) {
        //some action is chosen so show the options for it
        const optionForm = new ModalFormData()
        .title("Choose options");

        if (msg.wandState.action.keepReplaceOpt){
          optionForm.toggle("Keep existing blocks", false);
        }

        if (msg.wandState.action.blockOpt){
          optionForm.dropdown(`Use Block (selected = ${msg.wandState.firstBlock}`, ["selected","air", "water", "lava"], 0);
        }
        if (msg.wandState.action.directionOpt){
          optionForm.dropdown(`Direction`, ["x", "y", "z"], 0);
        }

        // logging.log(`about to show optionForm`);
        optionForm.show(msg.player).then(optionResponse => {
          msg.wandState.keep = optionResponse.formValues![0];
          msg.wandState.blockOpt = optionResponse.formValues![1];
          msg.wandState.direction = optionResponse.formValues![2] ;

          playerWandStates.set(msg.player.name, msg.wandState);
          //setup selected action
          msg.wandState.action.message(msg.wandState);

        });

      }
      
      }
  });

  
}

function itemUseOn(args: ItemUseOnEvent) {

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

async function useWand(args: ItemUseOnEvent) {

  // logging.log(`name ${args.source.nameTag}`);

  if (!playerWandStates.has(args.source.nameTag)){
    logging.log(`No wandstate for ${args.source.nameTag}`);
    return;
  }

  let wandState = playerWandStates.get(args.source.nameTag) ?? new PlayerWandState() ;
  if (wandState.state === enums.WandState.Initial){
    
    const clickedBlock = world.getDimension("overworld").getBlock(args.blockLocation);
    wandState.firstBlock = clickedBlock;
    wandState.state = enums.WandState.SelectedBlock;

    logging.log(`Selected block ${wandState.firstBlock} permuation:${JSON.stringify(wandState.firstBlock.permutation.getAllProperties())}`);

    const actionChooseForm = new ActionFormData()
    .title("Action")
    .body("What would you like to do?");

    for (let i = 0; i < ActionList.actions.length; i++) {
      actionChooseForm.button(ActionList.actions[i].name);
    }

    let showOptionForm = false;
    let player = <Player>args.source;

    let response = await actionChooseForm.show(player);

    if(response){
      logging.log(`you chose ${response.selection!}`);

      wandState.action = ActionList.actions[response.selection!] ;
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
    };

    if (showOptionForm){
      const message = new PlayerMessage(wandState, enums.Dialog.OptionChoose, player);
      playerMessaging.set(player.name, message);
      return;
    }  
  }

  //set block position
  if (wandState.state === enums.WandState.SelectedBlock){
    
    wandState.firstPosition = args.blockLocation;
    wandState.state = enums.WandState.SelectedFirstPosition;

    logging.log(`SelectedFirstPosition ${wandState.firstPosition}`);
  }
  else if (wandState.state === enums.WandState.SelectedFirstPosition){
    
    wandState.secondPosition = args.blockLocation;
    wandState.state = enums.WandState.SelectedSecondPosition;

    logging.log(`SelectedSecondPosition ${wandState.secondPosition}`);

    // logging.log(`GO ${JSON.stringify(wandState)}`);

    let map = wandState.action.execute(wandState); //slightly odd syntax but sort later
    let variant = 0;
    draw(map, args.source, variant, wandState);

    transitionToInitial(args.source);    
  }
}

function playerJoin(args: PlayerJoinEvent) {
  playerWandStates.set(args.player.name, new PlayerWandState());
}

function playerLeave(args: PlayerLeaveEvent) {
  playerWandStates.delete(args.playerName);
}

//changes wand state back to initial
function transitionToInitial(entity:Entity){
  let wandState = new PlayerWandState();
  playerWandStates.set(entity.nameTag, wandState)
}

world.events.tick.subscribe(mainTick);
world.events.playerJoin.subscribe(playerJoin);
world.events.playerLeave.subscribe(playerLeave);
world.events.itemUseOn.subscribe(itemUseOn);

function draw(map:MapWithOffset, 
  player:Entity, 
  variant:number,
  wandState: PlayerWandState) {

	//create undo buffer for this action
	let thisUndo = new Array<UndoItem>();
	undoMap.set(player.id, thisUndo);

	//let commands = new Array();
    map.map.forEach(element => {
		//log(element);
		//get coords of block

		const x = Math.floor(wandState.firstPosition.x + element.x - map.offset.x);
		const y = Math.floor(wandState.firstPosition.y + element.y - map.offset.y);
		const z = Math.floor(wandState.firstPosition.z + element.z - map.offset.z);
		const pos = new BlockLocation(x,y,z);

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
    } catch (error) {
        //ignore errors for now
        logging.log(`error:${JSON.stringify(error)}`);
    }


    });

}

class UndoItem {
  block: Block;
  blockState: any;

  constructor(block: Block, blockState: any) {
    this.block = block;
    this.blockState = blockState;
  }
}

