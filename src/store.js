function Store() {
	this.controller = Observable.controlSync()
	this.initialState = {}
	this.__state__ = {}
	this.set(this.getInitialState())
}

Store.prototype.getInitialState = function () {
	return JSON.parse(JSON.stringify(this.initialState))
}

Store.prototype.get =
Store.prototype.getState = function () {
	return this.__state__
}

Store.prototype.set =
Store.prototype.setState = function (state) {
	if (!isObject(state)) return
	for (var key in state) if (state.hasOwnProperty(key)) {
		this.__state__[key] = state[key]
	}
	this.controller.add(state)
	return this.__state__
}

Store.prototype.reset =
Store.prototype.resetState = function () {
	this.__state__ = {}
	return this.set(this.getInitialState())
}

Store.prototype.listen = function (callback) {
	return this.controller.stream.listen(callback)
}

Store.prototype.listenTo = function (action, onNext, onFail) {
	if (isFunction(action) && isString(action.actionName)) {
		onNext = onNext || this['on' + action.actionName]
		onFail = onFail || this['on' + action.actionName + 'Fail']

		if (isFunction(onNext) || isFunction(onFail)) {
			action.listen(
				onNext && onNext.bind(this),
				onFail && onFail.bind(this)
			)
		}
	}
	if (arguments.length === 1 && (isFunction(action) || isObject(action))) {
		for (var key in action) if (action.hasOwnProperty(key)) {
			this.listenTo(action[key])
		}
	}
}
