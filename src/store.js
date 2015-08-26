function Store() {
	this.initialState || (this.initialState = {})
	this.__controller__ = Observable.control(true)
	this.__state__ = {}
	this.set(this.getInitialState())
}

Store.prototype.getInitialState = function () {
	return JSON.parse(JSON.stringify(this.initialState || {}))
}

Store.prototype.get =
Store.prototype.getState = function () {
	return this.__state__
}

Store.prototype.set =
Store.prototype.setState = function (state) {
	if (!isObject(state)) return
	assign(this.__state__, state)
	this.__controller__.add(state)
	return this.__state__
}

Store.prototype.reset =
Store.prototype.resetState = function () {
	this.__state__ = {}
	return this.set(this.getInitialState())
}

Store.prototype.listen = function (callback) {
	return this.__controller__.stream.listen(callback)
}

Store.prototype.listenTo = function (action, onNext, onFail) {
	if (isFunction(action) && isString(action.actionType)) {
		var actionType = action.actionType
		actionType = actionType[0].toUpperCase() + actionType.slice(1)
		onNext = onNext || this['on' + actionType]
		onFail = onFail || this['on' + actionType + 'Fail']

		if (isFunction(onNext) || isFunction(onFail)) {
			action.listen(
				onNext && onNext.bind(this),
				onFail && onFail.bind(this)
			)
		}
	}
	if (arguments.length === 1 && (isFunction(action) || isObject(action))) {
		for (var key in action) if (action.hasOwnProperty(key)) {
			this.listenTo(action[key])
		}
	}
}
