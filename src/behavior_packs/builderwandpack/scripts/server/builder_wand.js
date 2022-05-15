//TODO: help guide in ui
//TODO: ui adapt to screen size better
//TODO: filled cuboid using draw so we can do an undo
//TODO: pass selected block name to UI for display
//TODO: survival mode fix

const system = server.registerSystem(0, 0);

const BuilderWandName = "dabby:builder_wand";
var blockToFill = null;
var startPos = null;
var endBlock = null;

//player:1,undo:[{block:block,blockstate:blockstate}]
var undo = {} ;  

system.initialize = function () {

	system.listenForEvent("minecraft:entity_use_item", (eventData) => this.onUseItem(eventData));

	this.registerEventData("dabby:use_builder_wand", { data: {
														player: null,
														ticking: null,
														position: null
														}});

	system.listenForEvent("dabby:do_wand_action", (eventData) => this.onWandAction(eventData));

};

system.onUseItem = function (eventData) {
	//log("onUseItem", eventData);

	if (eventData.data.entity.__identifier__  !== "minecraft:player")
		return;

	// Get the players hand container
	let handContainer = system.getComponent(eventData.data.entity, "minecraft:hand_container");
	// Get the players offhand item
	let handItem = handContainer.data[0];
	// Destroy the block entity if the player has EmeraldPickAxeName in their hand
	if (handItem.item == BuilderWandName) {
		//destroy the block. setblock with destroy option will leave the loot behind still
		//system.executeCommand("/setblock " + eventData.data.block_position.x + " " + eventData.data.block_position.y + " " + eventData.data.block_position.z + " air 1 destroy", (commandResultData) => commandCallback(commandResultData));
		let useWandEventData = this.createEventData("dabby:use_builder_wand");
		useWandEventData.data.player = eventData.data.entity;
		const ticking = system.getComponent(eventData.data.entity, "minecraft:tick_world");
		const position = system.getComponent(eventData.data.entity, "minecraft:position");

		useWandEventData.data.ticking = ticking.data.ticking_area;
		useWandEventData.data.position = position.data;
		system.broadcastEvent("dabby:use_builder_wand", useWandEventData);

		//determine which slot in hot bar the item is and add it back there
		let playerHotbar = system.getComponent(eventData.data.entity, "minecraft:hotbar_container");
		let foundItemIndex = null;
		for (let index = 0; index < playerHotbar.data.length; index++) {
			const element = playerHotbar.data[index];
			if (element.item === BuilderWandName) {
				foundItemIndex = index;
				break;
			}
		}	

		if (foundItemIndex) {
			let playerName = system.getComponent(eventData.data.entity, "minecraft:nameable");
			system.executeCommand("/replaceitem entity " + playerName.data.name + " slot.hotbar " + foundItemIndex + " " + BuilderWandName + " 1", (commandResultData) => commandCallback(commandResultData));
	
		}

	}

};

system.onWandAction = function(eventData) {

	//handle undo if requested
	if (eventData.data.action === "undo"){
		this.undo(eventData.data.player);
		return;
	}

	const startPos = eventData.data.startPos;
	const endPos = eventData.data.endPos;

	let blockName = this.getBlockName(eventData.data.blockIdentifier);

	//blockstate will contain what block state it is, we'd to translate that to an int id variant value
	//e.g. https://minecraft.gamepedia.com/Planks#Block_states
	//if wood then blockState.data.wood_type is the type of wood
	let blockState = system.getComponent(eventData.data.block, "minecraft:blockstate");
	let variant = 0;

	if (blockState && blockState.data) {
		if (blockState.data.wood_type){
			variant = getWoodVariant(blockState.data.wood_type);
		}
		else if (blockState.data.color) {
			variant = getColorVariant(blockState.data.color);
		}
		else if (blockState.data.old_leaf_type) {
			variant = getOldLeafVariant(blockState.data.old_leaf_type);
		}
		else if (blockState.data.new_leaf_type) {
			variant = getNewLeafVariant(blockState.data.new_leaf_type);
		}
	}


	log("blockState", blockState);

	if (eventData.data.action === "cuboid") {
		log("cuboid");
		const command = "/fill " + Math.floor(startPos.x) + " " + Math.floor(startPos.y) + " " + Math.floor(startPos.z) + " " + Math.floor(endPos.x) + " " + Math.floor(endPos.y) + " " + Math.floor(endPos.z) + " " + blockName + " 0 " + eventData.data.replaceOrKeep;
		system.executeCommand(command, (commandResultData) => commandCallback(commandResultData));

	}
	else if (eventData.data.action === "hollowCuboid") {
		log("hollow cuboid");
		const vectorAB = vectorAToB(startPos, endPos);
		let widlen = getWidthAndLengthWithAxis(vectorAB, eventData.data.direction);

		let result = cuboid_hollow(widlen.width, widlen.length, eventData.data.direction);
		this.draw(result.map, blockName, startPos, result.offset, eventData.data.player, eventData.data.ticking, eventData.data.replaceOrKeep, variant);
	}
	else if (eventData.data.action === "pyramid") {
		log("pyramid");
		const vectorAB = vectorAToB(startPos, endPos);
		let widlen = getWidthAndLengthWithAxis(vectorAB, eventData.data.direction);

		let result = pyramid(widlen.width, widlen.length, eventData.data.direction);
		this.draw(result.map, blockName, startPos, result.offset, eventData.data.player, eventData.data.ticking, eventData.data.replaceOrKeep, variant);
	}
	else if (eventData.data.action === "sphere") {
		log("sphere");
		const dir = vectorAToB(startPos, endPos);
		const radius = Math.round(magnitude(dir));

		let result = sphere_of_radius(radius);
		this.draw(result.map, blockName, startPos, result.offset, eventData.data.player, eventData.data.ticking, eventData.data.replaceOrKeep, variant);
	}
	else if (eventData.data.action === "hemisphere"){
		log("hemisphere");
		const dir = vectorAToB(startPos, endPos);
		const radius = Math.round(magnitude(dir));

		let result = hemisphere_of_radius(radius);
		this.draw(result.map, blockName, startPos, result.offset, eventData.data.player, eventData.data.ticking, eventData.data.replaceOrKeep, variant);
	}	
	else if (eventData.data.action === "cylinder"){
		log("cylinder");
		const vectorAB = vectorAToB(startPos, endPos);

		let radlen = getRadiusAndLengthWithAxis(vectorAB, eventData.data.direction);

		let result = cylinder_of_radius(radlen.radius, radlen.length, eventData.data.direction);
		this.draw(result.map, blockName, startPos, result.offset, eventData.data.player, eventData.data.ticking, eventData.data.replaceOrKeep, variant);
	}	
	else if (eventData.data.action === "cone"){
		log("cone");
		const vectorAB = vectorAToB(startPos, endPos);
		let radlen = getRadiusAndLengthWithAxis(vectorAB, eventData.data.direction);

		let result = cone_of_radius(radlen.radius, radlen.length, eventData.data.direction);
		this.draw(result.map, blockName, startPos, result.offset, eventData.data.player, eventData.data.ticking, eventData.data.replaceOrKeep, variant);
	}
	else if (eventData.data.action === "line"){
		log("line");
		let result = line3D(startPos, endPos);
		let zeroVector = {x:0,y:0,z:0}; //for line the position is already in the line
		this.draw(result.map, blockName, zeroVector, result.offset, eventData.data.player, eventData.data.ticking, eventData.data.replaceOrKeep, variant);
	}	
	else if (eventData.data.action === "wall"){
		log("wall");
		let result = wall(startPos, endPos, eventData.data.direction);
		let zeroVector = {x:0,y:0,z:0}; //for line the position is already in the line
		this.draw(result.map, blockName, zeroVector, result.offset, eventData.data.player, eventData.data.ticking, eventData.data.replaceOrKeep, variant);
	}
}

system.getBlockName = function(block) {
	let blockName = block;
	let regex = /.*:(.*)/;
	let match = regex.exec(blockName);
	if (match != null && match.length > 1) {
		blockName = match[1];
	}

	return blockName;
}

getRadiusAndLengthWithAxis = function(vector, axis) {
	let radius;
	let length =Math.floor(vector.y);
	if (axis === "x") {
		radius = Math.round(magnitude2d(vector.y, vector.z));
		length = Math.floor(vector.x);
	}
	else if (axis === "z") {
		radius = Math.round(magnitude2d(vector.y, vector.x));
		length = Math.floor(vector.x);
	}
	else {
		radius = Math.round(magnitude2d(vector.x, vector.z));
	}

	return {radius: radius, length: length};
}

getWidthAndLengthWithAxis = function(vector, axis) {
	let radius;
	let length =vector.y;
	if (axis === "x") {
		width = 2 * magnitude2d(vector.y, vector.z);
		length = vector.x;
	}
	else if (axis === "z") {
		width = 2 * magnitude2d(vector.y, vector.x);
		length = vector.x;
	}
	else {
		width = 2 * magnitude2d(vector.x, vector.z);
	}

	return {width: width, length: length};
}

//draws the map 
system.draw = function(map, blockName, startPos, offset, player, ticking, replaceOrKeep, variant) {

	//create undo buffer for this action
	let thisUndo = new Array();
	undo[player.id] = thisUndo;

	//let commands = new Array();
    map.forEach(element => {
		//log(element);
		//get coords of block
		const x = Math.floor(startPos.x + element.x - offset.x);
		const y = Math.floor(startPos.y + element.y - offset.y);
		const z = Math.floor(startPos.z + element.z - offset.z);
		const pos = {x:x,y:y,z:z};

		//get the block and record it in the players undo
		let currentBlock = system.getBlock(ticking, pos);
		let blockState = system.getComponent(currentBlock, "minecraft:blockstate");
		thisUndo.push({block:currentBlock, state:blockState});

		const command = "/setblock " + x + " " + y + " " + z + " " + blockName + " " + variant + " " + replaceOrKeep;
		//commands.push(command);
		//system.executeCommand(command);
		system.executeCommand(command, (commandResultData) => commandCallback(commandResultData));
    });

    // for (p[0]=-0.5,x=0;x<n;x++,p[0]+=dp)
    //  for (p[1]=-0.5,y=0;y<n;y++,p[1]+=dp)
    //   for (p[2]=-0.5,z=0;z<n;z++,p[2]+=dp)
    //     {
    //         log(map[x][y][z]);
	//     }
	///this.executeCommandChain(commands);
}

system.undo = function(player) {
	let undoBuffer = undo[player.id];

	if (!undoBuffer)
		return;

	undoBuffer.forEach(element => {
		//log(element);
		//get coords of block
		const x = element.block.block_position.x ;
		const y = element.block.block_position.y;
		const z = element.block.block_position.z;
		const blockName = this.getBlockName(element.block.__identifier__);

		const command = "/setblock " + x + " " + y + " " + z + " " + blockName + " 1 replace";
		//commands.push(command);
		//system.executeCommand(command);
		system.executeCommand(command, (commandResultData) => commandCallback(commandResultData));
	});
}

//runs command sequentially (in reverse) to the array so reverse first if order important
system.executeCommandChain = function(commands) {

	if (!commands || commands.length == 0)
		return;

	const command = commands.pop();

	system.executeCommand(command, (commandResultData) => 
		{
			commandCallback(commandResultData);
			this.executeCommandChain(commands);
		}
		);
}