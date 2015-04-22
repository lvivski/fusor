(function(global) {
  "use strict";
  var Promise, Stream, Flux = {};
  if (typeof define === "function" && define.amd) {
    define([ "davy", "streamlet" ], function(davy, streamlet) {
      Promise = davy;
      Stream = streamlet;
      return Flux;
    });
  } else if (typeof module === "object" && module.exports) {
    Promise = require("davy");
    Stream = require("streamlet");
    module.exports = Flux;
  } else {
    Promise = global.Davy;
    Stream = global.Streamlet;
    global.Flex = Flux;
  }
  Flux.createStore = function(spec) {
    var store = extend(new Store(), spec);
    if (isFunction(spec.initialize)) {
      spec.initialize.call(store);
    }
    return store;
  };
  Flux.createAction = function(name) {
    var controller = Stream.create(), stream = controller.stream, action = function Action(data) {
      controller.add(data);
    }, extra = {
      actionName: name,
      listen: function() {
        stream.listen.apply(stream, arguments);
      }
    };
    return extend(action, extra);
  };
  Flux.createActions = function(spec) {
    var actions = {};
    for (var action in spec) {
      if (spec.hasOwnProperty(action)) {
        var value = spec[action], actionName = isObject(value) ? action : value;
        actions[actionName] = isObject(value) ? this.createActions(value) : this.createAction(actionName);
      }
    }
    return actions;
  };
  Flux.ListenerMixin = {
    componentWillMount: function() {
      this.subscriptions = [];
    },
    componentWillUnmount: function() {
      var i = 0;
      while (i < this.subscriptions.length) {
        this.subscriptions[i++]();
      }
    },
    listenTo: function(stream, listener) {
      this.subscriptions.push(stream.listen(listener));
    },
    onEvent: function(stream, event, listener) {
      this.subscriptions.push(stream.on(event, listener));
    }
  };
  function Store() {
    this.controller = new Stream.create();
  }
  Store.prototype.emit = function(eventType, payload) {
    this.controller.add({
      eventType: eventType,
      payload: payload
    });
  };
  Store.prototype.on = function(eventType, callback) {
    if (isFunction(eventType) && !callback) {
      return this.controller.stream.listen(eventType);
    } else {
      return this.controller.stream.filter(function(event) {
        return event.eventType === eventType;
      }).map(function(event) {
        return event.payload;
      }).listen(callback);
    }
  };
  Store.prototype.listenTo = function(action, handler) {
    action.listen(function(store) {
      return function(data) {
        handler.call(store, data);
      };
    }(this));
  };
  function extend(obj) {
    if (!isObject(obj) && !isFunction(obj)) {
      return obj;
    }
    var i = 0;
    while (i < arguments.length) {
      var source = arguments[i++];
      for (var property in source) {
        obj[property] = source[property];
      }
    }
    return obj;
  }
  function isObject(obj) {
    return obj && typeof obj === "object";
  }
  function isFunction(fn) {
    return fn && typeof fn === "function";
  }
  function isString(str) {
    return str && typeof str === "string";
  }
})(this);