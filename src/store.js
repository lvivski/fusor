var STATE = '__state' + Math.random() + '__',
	CONTROLLER = '__controller' + Math.random() + '__'

function Store() {
	this.initialState || (this.initialState = {})
	this[CONTROLLER] = Observable.controlSync()
	this[STATE] = {}
	this.set(this.getInitialState())
}

Object.defineProperty(Observable.prototype, STATE, {
	configurable: true,
	writable: true,
	value: undefined
})

Object.defineProperty(Observable.prototype, CONTROLLER, {
	configurable: true,
	writable: true,
	value: undefined
})

Store.prototype.getInitialState = function () {
	return JSON.parse(JSON.stringify(this.initialState || {}))
}

Store.prototype.get =
Store.prototype.getState = function () {
	return this[STATE]
}

Store.prototype.set =
Store.prototype.setState = function (state) {
	if (!isObject(state)) return
	extend(this[STATE], state)
	this[CONTROLLER].add(state)
	return this[STATE]
}

Store.prototype.reset =
Store.prototype.resetState = function () {
	this[STATE] = {}
	return this.set(this.getInitialState())
}

Store.prototype.listen = function (callback) {
	return this[CONTROLLER].stream.listen(callback)
}

Store.prototype.listenTo = function (action, onNext, onFail) {
	if (isFunction(action) && isString(action.actionName)) {
		var actionName = action.actionName
		actionName = actionName[0].toUpperCase() + actionName.slice(1)
		onNext = onNext || this['on' + actionName]
		onFail = onFail || this['on' + actionName + 'Fail']

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
