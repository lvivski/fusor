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
  Flux.Promise = Promise;
  Flux.Stream = Stream;
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
      new Promise(function(resolve) {
        resolve(data);
      }).then(handler).then(function(value) {
        controller.next(value);
      }, function(error) {
        controller.fail(error);
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
    this.controller = new Stream.create();
  }
  Store.prototype.emit = function(data) {
    return this.controller.add(data);
  };
  Store.prototype.listen = function(callback) {
    return this.controller.stream.listen(callback);
  };
  Store.prototype.listenTo = function(action, onNext, onFail) {
    var self = this;
    return action.listen(function(value) {
      if (isFunction(onNext)) {
        onNext.call(self, value);
      }
    }, function(error) {
      if (isFunction(onFail)) {
        onFail.call(self, error);
      }
    });
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