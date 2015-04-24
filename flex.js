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
  Flux.createAction = function(name, handler) {
    if (!isFunction(handler)) {
      handler = function(_) {
        return _;
      };
    }
    var controller = Stream.create(true), stream = controller.stream, action = function Action(data) {
      return new Promise(function(resolve) {
        resolve(handler(data));
      }).then(function(value) {
        controller.next(value);
        return value;
      }, function(error) {
        controller.fail(error);
        throw error;
      });
    }, extra = {
      actionName: name,
      listen: function() {
        stream.listen.apply(stream, arguments);
      }
    };
    return extend(action, extra);
  };
  Flux.createActions = function(spec, parent) {
    parent || (parent = "");
    var actions = {};
    for (var action in spec) {
      if (spec.hasOwnProperty(action)) {
        var value = spec[action], actionName = isString(value) ? value : action;
        var parentActionName = parent + actionName;
        if (isObject(value)) {
          var handler = value.$;
          delete value.$;
          actions[actionName] = extend(this.createAction(parentActionName, handler), this.createActions(value, parentActionName));
        } else {
          actions[actionName] = this.createAction(parentActionName, value);
        }
      }
    }
    return actions;
  };
  Flux.saveState = function(store) {
    return JSON.stringify(obj.state);
  };
  Flux.restoreState = function(store, state) {
    store.emit(isObject(state) ? state : JSON.parse(state));
  };
  Flux.Promise = Promise;
  Flux.Stream = Stream;
  Flux.Store = Store;
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
    }
  };
  function Store() {
    this.controller = Stream.create(this);
    this.state = {};
  }
  Store.prototype.emit = function(state) {
    for (var key in state) if (state.hasOwnProperty(key)) {
      this.state[key] = state[key];
    }
    return this.controller.add(state);
  };
  Store.prototype.listen = function(callback) {
    return this.controller.stream.listen(callback);
  };
  Store.prototype.listenTo = function(action, onNext, onFail) {
    if (isFunction(onNext)) {
      onNext = onNext.bind(this);
    }
    if (isFunction(onFail)) {
      onFail = onFail.bind(this);
    }
    return action.listen(onNext, onFail);
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