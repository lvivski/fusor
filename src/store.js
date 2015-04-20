function Store() {
	Stream.call(this)
}
Store.prototype = Object.create(Stream.prototype)
Store.prototype.constructor = Store
Store.prototype.emit = Store.prototype.add
Store.prototype.on = Store.prototype.listen
