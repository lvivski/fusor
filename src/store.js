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
	var self = this
	return action.listen(function (value) {
		if (isFunction(onNext)) {
			onNext.call(self, value)
		}
	}, function (error) {
		if (isFunction(onFail)) {
			onFail.call(self, error)
		}
	})
}
