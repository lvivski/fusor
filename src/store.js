function Store() {
	this.controller = Stream.create(this)
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
	if (isFunction(onNext)) {
		onNext = onNext.bind(this)
	}
	if (isFunction(onFail)) {
		onFail = onFail.bind(this)
	}
	return action.listen(onNext, onFail)
}
