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

Flux.createAction = function (name, handler) {
	if (!isFunction(handler)) {
		handler = function (_) {return _}
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
		replay = function () {
			if (!(this.isFulfilled || this.isRejected)) return
			return this.isFulfilled ? next(this.value) : fail(this.value)
		},
		action = function Action() {
			var args = arguments,
				ctx = this,
				promise = new Promise(function (resolve) {
					resolve(handler.apply(ctx, args))
				})
				.then(next, fail)
			promise._ = replay
			return promise
		},
		extra = {
			actionName: name,
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
				actionName = isString(value) ? value : action

			var parentActionName = parent + actionName

			if (isObject(value)) {
				var handler = value.$
				delete value.$
				actions[actionName] = assign(
					this.createAction(parentActionName, handler),
					this.createActions(value, parentActionName)
				)
			} else {
				actions[actionName] = this.createAction(parentActionName, value)
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
Flux.replayActions = function (actions, stores) {
	return Promise.all(actions).then(function (results) {
		return {
			then: function (callback) {
				return new Promise(function (resolve) {
					var i = 0
					while (i < stores.length) {
						stores[i++].reset()
					}
					i = 0
					while (i < actions.length) {
						actions[i++]._()
					}
					resolve(callback(results))
				})
			}
		}
	})
}

Flux.Promise = Promise
Flux.Observable = Observable
Flux.Store = Store
Flux.Actions = Actions

