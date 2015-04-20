(function(global) {
  "use strict";
  var Promise, Stream;
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
  function Store() {
    Stream.call(this);
  }
  Store.prototype = Object.create(Stream.prototype);
  Store.prototype.constructor = Store;
  Store.prototype.emit = Store.prototype.add;
  Store.prototype.on = Store.prototype.listen;
  var Flux = {};
  Flux.createStore = function(spec) {
    var store = new Store();
    extend(store, spec);
    if (isFunction(spec.initialize)) {
      spec.initialize.call(store);
    }
    return store;
  };
  Flux.createAction = function(name) {
    var stream = new Stream(), action = function Action() {
      Action.add.apply(Action, arguments);
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
        var value = spec[action], actionName = isString(action) ? action : value;
        actions[actionName] = isObject(value) ? this.createActions(value) : this.createAction(actionName);
      }
    }
    return actions;
  };
  Flux.ListenerMixin = {
    subscriptions: [],
    listenTo: function(stream, listener) {
      this.subscriptions.push(stream.listen(listener));
    },
    componentWillUnmount: function() {
      var i = 0;
      while (i < this.subscriptions.length) {
        this.subscriptions[i++]();
      }
    }
  };
  function extend(obj) {
    if (!isObject(obj) && !isFunction(obj)) {
      return obj;
    }
    for (var i = 1; i < arguments.length; ++i) {
      var source = arguments[i];
      for (var property in source) {
        if (source.hasOwnProperty(property)) {
          if (Object.getOwnPropertyDescriptor && Object.defineProperty) {
            var descriptor = Object.getOwnPropertyDescriptor(source, property);
            Object.defineProperty(obj, property, descriptor);
          } else {
            obj[property] = source[property];
          }
        }
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