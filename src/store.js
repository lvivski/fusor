function Store() {
	Stream.call(this)
}
Store.prototype = Object.create(Stream.prototype)
Store.prototype.constructor = Store

Store.prototype.emit = function (eventType, payload) {
	this.add({
		eventType: eventType,
		payload: payload
	});
}
Store.prototype.on = function (eventType, callback) {
	return this.filter(function (event) {
		return event.eventType === eventType
	}).map(function (event) {
		return event.payload
	}).listen(callback)
}

Store.prototype.listenTo = function (action, handler) {
	action.listen(function (store) {
		return function (data) {
			handler.call(store, data)
		}
	}(this))
}
