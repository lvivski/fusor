Flux.createStore = function (spec) {
	var store = extend(new Store, spec)
	store.set(store.getInitialState())

	if (isFunction(spec.initialize)) {
		spec.initialize.call(store)
	}
	return store
}

Flux.createAction = function (name, handler) {
	if (!isFunction(handler)) {
		handler = function (_) {return _}
	}

	var controller = Observable.controlSync(),
		stream = controller.stream,
		next = function (value) {
			controller.next(value)
			return value
		},
		fail = function (error) {
			controller.fail(error)
			throw error
		},
		action = function Action(data) {
			return new Promise(function (resolve) {
					resolve(handler(data))
				})
				.then(next, fail)
				.then(wrap(next), wrap(fail))
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
	for (var action in spec) if (spec.hasOwnProperty(action)) {
		var value = spec[action],
			actionName = isString(value) ? value : action

		var parentActionName = parent + actionName

		if (isObject(value)) {
			var handler = value.$
			delete value.$
			actions[actionName] = extend(
				this.createAction(parentActionName, handler),
				this.createActions(value, parentActionName)
			)
		} else {
			actions[actionName] = this.createAction(parentActionName, value)
		}
	}
	return actions
}

Flux.save =
Flux.saveState = function (store) {
	return JSON.stringify(store.get())
}

Flux.restore =
Flux.restoreState = function (store, state) {
	store.set(isObject(state) ? state : JSON.parse(state))
}

Flux.Promise = Promise
Flux.Observable = Observable
Flux.Store = Store


