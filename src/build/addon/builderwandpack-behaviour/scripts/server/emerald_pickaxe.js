const system = server.registerSystem(0, 0);

const EmeraldPickAxeName = "dabby:emerald_block_pickaxe";

system.initialize = function () {

    // system.listenForEvent("minecraft:entity_carried_item_changed", (eventData) => this.onChangeItem(eventData));
    system.listenForEvent("minecraft:block_destruction_started", (eventData) => this.onStartDestroyBlock(eventData));

};

system.onStartDestroyBlock = function (eventData) {
	// log("onStartDestroyBlock", eventData);

	//HANDLE EMERALD PICKAXE
	// Get the players hand container
	let handContainer = system.getComponent(eventData.data.player, "minecraft:hand_container");
	// Get the players offhand item
	let handItem = handContainer.data[0];
	// Destroy the block entity if the player has EmeraldPickAxeName in their hand
	if (handItem.item == EmeraldPickAxeName) {
		//destoroy the block. setblock with destroy option will leave the loot behind still
		system.executeCommand("/setblock " + eventData.data.block_position.x + " " + eventData.data.block_position.y + " " + eventData.data.block_position.z + " air 1 destroy", (commandResultData) => commandCallback(commandResultData));

	}

};
