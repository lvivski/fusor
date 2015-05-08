function Actions () {
	for (var name in this.constructor.prototype) {
		if (name !== 'constructor' && isFunction(this[name])) {
			this[name] = Flux.createAction(name, this[name])
		}
	}
}
