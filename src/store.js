function Store() {
	this.controller = new Stream.create()
}

Store.prototype.emit = function (eventType, payload) {
	this.controller.add({
		eventType: eventType,
		payload: payload
	})
}
Store.prototype.on = function (eventType, callback) {
	if (isFunction(eventType) && !callback) {
		return this.controller.stream.listen(eventType)
	} else {
		return this.controller.stream.filter(function (event) {
			return event.eventType === eventType
		}).map(function (event) {
			return event.payload
		}).listen(callback)
	}
}

Store.prototype.listenTo = function (action, handler) {
	action.listen(function (store) {
		return function (data) {
			handler.call(store, data)
		}
	}(this))
}
