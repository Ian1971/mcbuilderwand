const system = client.registerSystem(0, 0);

//TODO:handle block variants
//TODO: wall non vertical ? good for ceilings and floors?

const EnableLogging = true;

// A query to control fighters that need to be animated
var blockToFillId = null; //the block id that should be filled (may differ if air/water etc selected)
var blockToFill = null; //the selected block
var startPos = null;
var endPos = null;
var lastHit = null;
var action = "cuboid";
var replaceOrKeep = "replace";
var isX = false;
var ticking = null;
var player = null;
var direction = "y";

var spacial_query = {};

// Setup which events to listen for
system.initialize = function () {
    
    // Setup callback for when the player enters the world
    system.listenForEvent("minecraft:client_entered_world", (eventData) => this.onClientEnteredWorld(eventData));
    system.listenForEvent("minecraft:hit_result_continuous", (eventData) => this.onHitChanged(eventData));
    
    system.listenForEvent("dabby:use_builder_wand", (eventData) => this.onUseBuilderWand(eventData));
    
    this.listenForEvent("minecraft:ui_event", (eventData) => this.onUIMessage(eventData));

    this.registerEventData("dabby:do_wand_action", { data: {
        blockToFillId: null,
        block: null,
        startPos: null,
        endPos: null,
        action: "cuboid",
        direction: "y",
        replaceOrKeep: "replace",
        ticking: null,
        player: null //the player using the wand
        }});

    this.registerEventData("dabby:show_wand_menu", { data: {
        }});

    spacial_query = this.registerQuery("minecraft:position", "x", "y", "z"); 
};

// system.update = function () {

// };
// system.update = function() {
//     let chatEvent = this.createEventData("minecraft:display_chat_event");
//     chatEvent.data.message = "Hello, World!";
//     this.broadcastEvent("minecraft:display_chat_event", chatEvent);
//   };

system.onClientEnteredWorld = function (eventData) {
    // this.broadcastEvent("minecraft:display_chat_event", eventData);
    // log(eventData);
    player = eventData.data.player;
    
    // // Notify the server script that the player has finished loading in.
    // let clientEnteredEventData = this.createEventData("infeasibler:client_entered_world");
    // clientEnteredEventData.data.player = eventData.data.player;
    // system.broadcastEvent("infeasibler:client_entered_world", clientEnteredEventData);
    
};

system.onUIMessage = function (eventData) {
    //log("uimessage", eventData)

    direction = "y";

    let split = eventData.data.split("_");
    let data = {action:split[0], direction:"y", block:"selected", replaceOrKeep:"replace"};
    if (split.length > 0){
        data.direction = split[1];
    }
    if (split.length > 1){
        data.block = split[2];
    }    
    if (split.length > 2){
        data.replaceOrKeep = split[3];
    }

    if (data.action === "undo") {
        action = "undo";
        blockToFillId = null;
        blockToFill = null;
        this.fireDoWandAction();
    }
    else if (data.action === "cancel") {
        action = null;
        blockToFillId = null;
        blockToFill = null;
    }
    else {
        action = data.action;
        direction = data.direction;
        replaceOrKeep = data.replaceOrKeep;
        if (data.block !== "selected") {
            blockToFillId = data.block;
        }
    }

    if (blockToFillId !== null ) {
        msg("Now click when you are standing on the place you want to start from");
    }
        
    //close the ui
    let unloadEventData = system.createEventData("minecraft:unload_ui");
    unloadEventData.data.path = "wand_chooser.html";
    unloadEventData.log_errors = true;
    unloadEventData.log_information = true;
    unloadEventData.log_warnings = true;
    system.broadcastEvent("minecraft:unload_ui", unloadEventData);
};

system.onHitChanged = function(eventData) {
    if(eventData.data.position != null) {
        lastHit=eventData.data.position;
        // log("lastHit", lastHit);
    }
  };

system.onUseBuilderWand = function(eventData) {
    // log("onUseBuilderWand", eventData);

    //ignore if wrong player
    if (eventData.data.player.id !== player.id) {
        return;
    }

    ticking = eventData.data.ticking;

    //what state are we in. 
    //blockToFill = null means we need to choose the block
    if (blockToFillId == null){
        const playerPos = eventData.data.position;
        let direction = {x: lastHit.x - playerPos.x, y: lastHit.y - playerPos.y, z: lastHit.z - playerPos.z}
        // log("lastHit", lastHit);
        // log("direction", direction);

        //we need to adjust the position when getting the actual block because the report
        //hit position is out by one depending on which face of the block it is.
        //it seems that last hit is a whole number for the side that is facing

        //if one of the numbers in last hit is a whole number that is the way it is facing
        //if the block is facing positive x (x whole and direction.x is negative it will be not be ok - subtract 1 from x)
        //if the block is facing negative x (x whole and direction.x is positive  it will be ok)
        const facingX = lastHit.x - Math.floor(lastHit.x) == 0;
        let adjustedX = lastHit.x;
        if (facingX && direction.x <= 0) {
            adjustedX--;
        }

        //if the block is facing positive z (z whole and direction.z is negative it will be not be ok - subtract 1 from z)
        //if the block is facing negative z (z whole and direction.z is positive  it will be ok)
        const facingZ = lastHit.z - Math.floor(lastHit.z) == 0;
        let adjustedZ = lastHit.z;
        if (facingZ && direction.z <= 0) {
            adjustedZ--;
        }

        //if the block is facing positive y (y whole and direction.y is negative it will be not be ok - subtract 1 from y)
        //if the block is facing negative y (y whole and direction.y is positive  it will be ok)
        const facingY = lastHit.y - Math.floor(lastHit.y) == 0;
        let adjustedY = lastHit.y;
        if (facingY && direction.y <= 0) {
            adjustedY--;
        }

        let adjustedPos = {x:adjustedX, y:adjustedY, z:adjustedZ };
        blockToFill = system.getBlock(ticking, adjustedPos);
        blockToFillId = blockToFill.__identifier__;
        // log("blockToFill", blockToFill);

        msg("Selected block" + blockToFillId);
        // let showWandMenuEventData = this.createEventData("dabby:show_wand_menu");
        // system.broadcastEvent("dabby:show_wand_menu", showWandMenuEventData);
        this.showWandMenu();
        

    }
    else if (startPos == null) {
        //set start position ti player position
        startPos = eventData.data.position;

        msg("Now click when you are standing on the place you want to end at");
    }
    else {
        //fill from start pos to end pos then reset
        endPos = eventData.data.position;

        msg("Presto!");

        this.fireDoWandAction();
        
        blockToFillId = null;
        blockToFill = null;
        startPos = null;
        endPos = null;
    }

    //debug - disables all but block detection
    // blockToFill = null;
};

system.fireDoWandAction = function() {
    let doWandActionEventData = this.createEventData("dabby:do_wand_action");

    doWandActionEventData.data.blockIdentifier = blockToFillId;
    doWandActionEventData.data.block = blockToFill;
    doWandActionEventData.data.startPos = startPos;
    doWandActionEventData.data.endPos = endPos;
    doWandActionEventData.data.action = action;
    doWandActionEventData.data.direction = direction;
    doWandActionEventData.data.replaceOrKeep = replaceOrKeep;
    doWandActionEventData.data.ticking = ticking;
    doWandActionEventData.data.player = player;
    
    system.broadcastEvent("dabby:do_wand_action", doWandActionEventData);
}

  
system.showWandMenu = function () {
    // Client has entered the world, show the starting screen
    let loadEventData = system.createEventData("minecraft:load_ui");
    loadEventData.data.path = "wand_chooser.html";
    loadEventData.data.options.always_accepts_input = true;
    // loadEventData.data.options.is_showing_menu = true;
    loadEventData.data.options.absorbs_input = true;
    loadEventData.data.options.should_steal_mouse = false;
    loadEventData.data.options.force_render_below = true;
    loadEventData.data.options.render_only_when_topmost = true;
    loadEventData.data.options.render_game_behind = true;
    system.broadcastEvent("minecraft:load_ui", loadEventData);

};