var Flux = {}

Flux.createStore = function (spec) {
	var store = new Store
	extend(store, spec)

	if (isFunction(spec.initialize)) {
		spec.initialize.call(store)
	}

	return store
}

Flux.createAction = function (name) {
	var stream = new Stream,
		action = function Action() {
			Action.add.apply(Action, arguments)
		}

	extend(action, stream, {actionName: name})

	return action
}

Flux.createActions = function (spec) {
	var actions = {}
	for (var action in spec) {
		if (spec.hasOwnProperty(action)) {
			var value = spec[action],
				actionName = isString(action) ? action : value

			actions[actionName] = isObject(value) ?
				this.createActions(value) :
				this.createAction(actionName)
		}
	}
	return actions
}


