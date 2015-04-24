function Store() {
	this.controller = Stream.create(this)
	this.state = {}
}

Store.prototype.get =
Store.prototype.getState = function () {
	return this.state
}

Store.prototype.emit =
Store.prototype.set =
Store.prototype.setState = function (state) {
	for (var key in state) if (state.hasOwnProperty(key)) {
		this.state[key] = state[key]
	}
	return this.controller.add(state)
}

Store.prototype.clear =
Store.prototype.clearState = function () {
	this.state = {}
	return this.controller.add(this.state)
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
