function Store() {
	this.initialState || (this.initialState = {})
	var controller = Observable.control(true)
	this.stream = controller.stream
	this.add = controller.add.bind(controller)
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
	this.add(state)
	return assign(this.__state__, state)
}

Store.prototype.reset =
Store.prototype.resetState = function () {
	this.__state__ = {}
	return this.set(this.getInitialState())
}

Store.prototype.listenTo = function (action, onNext, onFail) {
	if (isFunction(action) && isString(action.actionType)) {
		var actionType = action.actionType
		actionType = actionType[0].toUpperCase() + actionType.slice(1)
		onNext = onNext || this['on' + actionType]
		onFail = onFail || this['on' + actionType + 'Fail']

		if (isFunction(onNext) || isFunction(onFail)) {
			action.stream.listen(
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
