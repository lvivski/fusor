function Store() {
	this.controller = Stream.create(this)
	this.state = {}
}

Store.prototype.emit = function (state) {
	for (var key in state) if (state.hasOwnProperty(key)) {
		this.state[key] = state[key]
	}
	return this.controller.add(state)
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
