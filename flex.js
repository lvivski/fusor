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
    var store = new Store();
    extend(store, spec);
    if (isFunction(spec.initialize)) {
      spec.initialize.call(store);
    }
    return store;
  };
  Flux.createAction = function(name) {
    var stream = new Stream(), action = function Action(data) {
      stream.add(data);
    };
    extend(action, stream, {
      actionName: name
    });
    return action;
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
    Stream.call(this);
  }
  Store.prototype = Object.create(Stream.prototype);
  Store.prototype.constructor = Store;
  Store.prototype.emit = function(eventType, payload) {
    this.add({
      eventType: eventType,
      payload: payload
    });
  };
  Store.prototype.on = function(eventType, callback) {
    return this.filter(function(event) {
      return event.eventType === eventType;
    }).map(function(event) {
      return event.payload;
    }).listen(callback);
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
    for (var i = 1; i < arguments.length; ++i) {
      var source = arguments[i];
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