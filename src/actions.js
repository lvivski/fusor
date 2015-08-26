function Actions () {
	var proto = this.constructor.prototype
	for (var name in proto) if (proto.hasOwnProperty(name)) {
		if (name !== 'constructor' && isFunction(this[name])) {
			this[name] = Flux.createAction(name, this[name])
		}
	}
}
