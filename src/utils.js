function extend(obj) {
	if (!isObject(obj) && !isFunction(obj)) {
		return obj
	}
	for (var i = 1; i < arguments.length; ++i) {
		var source = arguments[i]
		for (var property in source) {
			if (source.hasOwnProperty(property)) {
				if (Object.getOwnPropertyDescriptor && Object.defineProperty) {
					var descriptor = Object.getOwnPropertyDescriptor(source, property)
					Object.defineProperty(obj, property, descriptor)
				} else {
					obj[property] = source[property]
				}
			}
		}
	}
	return obj
}

function isObject(obj) {
	return obj && typeof obj === 'object'
}

function isFunction(fn) {
	return fn && typeof fn === 'function'
}

function isString(str) {
	return str && typeof str === 'string'
}
