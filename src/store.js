function Store() {
	this.controller = new Stream.create()
}

Store.prototype.emit = function (data) {
	return this.controller.add(data)
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
