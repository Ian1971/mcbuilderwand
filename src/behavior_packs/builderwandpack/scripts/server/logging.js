const system = server.registerSystem(0, 0);

const EnableLogging = false;

log = function(...items) {
	if (!EnableLogging) {
		return;
	}

	const toString = item => {
		switch(Object.prototype.toString.call(item)) {
			case '[object Undefined]':
				return 'undefined';
			case '[object Null]':
				return 'null';
			case '[object String]':
				return `"${item}"`;
			case '[object Array]':
				const array = item.map(toString);
				return `[${array.join(', ')}]`;
			case '[object Object]':
				const object = Object.keys(item).map(key => `${key}: ${toString(item[key])}`);
				return `{${object.join(', ')}}`;
			case '[object Function]':
				return item.toString();
			default:
				return item;
		}
	}

	system.emit('minecraft:display_chat_event', {message: items.map(toString).join(' ')});
};


commandCallback = function (commandResultData) {
	if (!EnableLogging) {
		return;
	}
	
	let eventData = system.createEventData("minecraft:display_chat_event");
	if (eventData) {
		eventData.data.message = "Callback called! Command: " + commandResultData.command + " Data: " + JSON.stringify(commandResultData.data, null, "    ");
		system.broadcastEvent("minecraft:display_chat_event", eventData);
	}
};


system.emit = function(identifier, properties) {
	const data = system.createEventData(identifier);
	data.data = Object.assign({}, data.data, properties);


	return system.broadcastEvent(identifier, data);
}
