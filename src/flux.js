function Flux() {}

Flux.createStore = function (store) {
	if (isFunction(store)) {
		assign(store.prototype, Store.prototype)
		store = new store
	} else {
		store = assign(new Store, store)
		if (isFunction(store.initialize)) {
			store.initialize.call(store)
		}
	}
	Store.call(store)
	return store
}

Flux.createAction = function (actionType, handler) {
	if (!isFunction(handler)) {
		handler = identity
	}
	var controller = Observable.control(true),
		stream = controller.stream,
		next = function (value) {
			controller.next(value)
			return value
		},
		fail = function (error) {
			controller.fail(error)
			throw error
		},
		action = function Action() {
			var args = arguments,
				ctx = this
			return new Promise(function (resolve) {
					resolve(handler.apply(ctx, args))
				})
				.then(next, fail)
		},
		extra = {
			actionType: actionType,
			listen: function (onNext, onFail) {
				return stream.listen(onNext, onFail)
			}
		}
	return assign(action, extra)
}

Flux.createActions = function (spec, parent) {
	parent || (parent = '')
	var actions = {}
	if (isFunction(spec)) {
		assign(spec.prototype, Actions.prototype)
		actions = new spec
	} else {
		for (var action in spec) if (spec.hasOwnProperty(action)) {
			var value = spec[action],
				actionType = isString(value) ? value : action

			var parentActionType = parent + actionType

			if (isObject(value)) {
				var handler = value.$
				delete value.$
				actions[actionType] = assign(
					this.createAction(parentActionType, handler),
					this.createActions(value, parentActionType)
				)
			} else {
				actions[actionType] = this.createAction(parentActionType, value)
			}
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

Flux.replay =
Flux.replayActions = function (actions) {
	return Promise.all(actions)
}

Flux.Promise = Promise
Flux.Observable = Observable
Flux.Store = Store
Flux.Actions = Actions

