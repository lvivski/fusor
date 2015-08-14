var Promise, Observable
if (typeof define === 'function' && define.amd) {
    define(['davy', 'streamlet'], function (davy, streamlet) {
        Promise = davy
        Observable = streamlet
        return Flux
    })
} else if (typeof module === 'object' && module.exports) {
    Promise = require('davy')
    Observable = require('streamlet')
    module.exports = Flux
} else {
    Promise = global.Davy
    Observable = global.Streamlet
    global.Fusor = Flux
}
