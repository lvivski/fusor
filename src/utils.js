function extend(obj) {
	if (!isObject(obj) && !isFunction(obj)) {
		return obj
	}
	var i = 1
	while (i < arguments.length) {
		var source = arguments[i++]
		for (var property in source) {
			if (Object.getOwnPropertyDescriptor && Object.defineProperty) {
				var propertyDescriptor = Object.getOwnPropertyDescriptor(source, property)
				Object.defineProperty(obj, property, propertyDescriptor || {})
			} else {
				obj[property] = source[property]
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
