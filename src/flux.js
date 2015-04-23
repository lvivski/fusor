Flux.Promise = Promise
Flux.Stream = Stream

Flux.createStore = function (spec) {
	var store = extend(new Store, spec)

	if (isFunction(spec.initialize)) {
		spec.initialize.call(store)
	}

	return store
}

Flux.createAction = function (name, handler) {
	if (!isFunction(handler)) {
		handler = function (_) {return _}
	}

	var controller = Stream.create(true),
		stream = controller.stream,
		action = function Action(data) {
			new Promise(function (resolve) {
					resolve(data)
				})
				.then(handler)
				.then(function (value) {
					controller.next(value)
				}, function (error) {
					controller.fail(error)
				})
		},
		extra = {
			actionName: name,
			listen: function () {
				stream.listen.apply(stream, arguments)
			}
		}

	return extend(action, extra)
}

Flux.createActions = function (spec, parent) {
	parent || (parent = '')
	var actions = {}
	for (var action in spec) {
		if (spec.hasOwnProperty(action)) {
			var value = spec[action],
				actionName = isString(value) ? value : action

			var parentActionName = parent + actionName

			if (isObject(value)) {
				var handler = value.$
				delete value.$
				actions[actionName] = extend(this.createAction(parentActionName, handler), this.createActions(value, parentActionName))
			} else {
				actions[actionName] = this.createAction(parentActionName, value)
			}
		}
	}
	return actions
}


