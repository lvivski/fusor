var Promise, Stream
if (typeof define === 'function' && define.amd) {
    define(['davy', 'streamlet'], function (davy, streamlet) {
        Promise = davy
        Stream = streamlet
        return Flux
    })
} else if (typeof module === 'object' && module.exports) {
    Promise = require('davy')
    Stream = require('streamlet')
    module.exports = Flux
} else {
    Promise = global.Davy
    Stream = global.Streamlet
    global.Flex = Flux
}
