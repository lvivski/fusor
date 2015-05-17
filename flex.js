(function(global) {
  "use strict";
  var Promise, Observable;
  if (typeof define === "function" && define.amd) {
    define([ "davy", "streamlet" ], function(davy, streamlet) {
      Promise = davy;
      Observable = streamlet;
      return Flux;
    });
  } else if (typeof module === "object" && module.exports) {
    Promise = require("davy");
    Observable = require("streamlet");
    module.exports = Flux;
  } else {
    Promise = global.Davy;
    Observable = global.Streamlet;
    global.Flex = Flux;
  }
  function Flux() {}
  Flux.createStore = function(store) {
    if (isFunction(store)) {
      assign(store.prototype, Store.prototype);
      store = new store();
    } else {
      store = assign(new Store(), store);
      if (isFunction(store.initialize)) {
        store.initialize.call(store);
      }
    }
    Store.call(store);
    return store;
  };
  Flux.createAction = function(name, handler) {
    if (!isFunction(handler)) {
      handler = function(_) {
        return _;
      };
    }
    var controller = Observable.control(true), stream = controller.stream, next = function(value) {
      controller.next(value);
      return value;
    }, fail = function(error) {
      controller.fail(error);
      throw error;
    }, replay = function() {
      if (!(this.isFulfilled || this.isRejected)) return;
      return this.isFulfilled ? next(this.value) : fail(this.value);
    }, action = function Action() {
      var args = arguments, ctx = this, promise = new Promise(function(resolve) {
        resolve(handler.apply(ctx, args));
      }).then(next, fail);
      promise._ = replay;
      return promise;
    }, extra = {
      actionName: name,
      listen: function(onNext, onFail) {
        return stream.listen(onNext, onFail);
      }
    };
    return assign(action, extra);
  };
  Flux.createActions = function(spec, parent) {
    parent || (parent = "");
    var actions = {};
    if (isFunction(spec)) {
      assign(spec.prototype, Actions.prototype);
      actions = new spec();
    } else {
      for (var action in spec) if (spec.hasOwnProperty(action)) {
        var value = spec[action], actionName = isString(value) ? value : action;
        var parentActionName = parent + actionName;
        if (isObject(value)) {
          var handler = value.$;
          delete value.$;
          actions[actionName] = assign(this.createAction(parentActionName, handler), this.createActions(value, parentActionName));
        } else {
          actions[actionName] = this.createAction(parentActionName, value);
        }
      }
    }
    return actions;
  };
  Flux.save = Flux.saveState = function(store) {
    return JSON.stringify(store.get());
  };
  Flux.restore = Flux.restoreState = function(store, state) {
    store.set(isObject(state) ? state : JSON.parse(state));
  };
  Flux.replay = Flux.replayActions = function(actions, stores) {
    return Promise.all(actions).then(function(results) {
      return {
        then: function(callback) {
          return new Promise(function(resolve) {
            var i = 0;
            while (i < stores.length) {
              stores[i++].reset();
            }
            i = 0;
            while (i < actions.length) {
              actions[i++]._();
            }
            resolve(callback(results));
          });
        }
      };
    });
  };
  Flux.Promise = Promise;
  Flux.Observable = Observable;
  Flux.Store = Store;
  Flux.Actions = Actions;
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
  function Actions() {
    for (var name in this.constructor.prototype) {
      if (name !== "constructor" && isFunction(this[name])) {
        this[name] = Flux.createAction(name, this[name]);
      }
    }
  }
  function Store() {
    this.initialState || (this.initialState = {});
    this.__controller__ = Observable.control(true);
    this.__state__ = {};
    this.set(this.getInitialState());
  }
  Store.prototype.getInitialState = function() {
    return JSON.parse(JSON.stringify(this.initialState || {}));
  };
  Store.prototype.get = Store.prototype.getState = function() {
    return this.__state__;
  };
  Store.prototype.set = Store.prototype.setState = function(state) {
    if (!isObject(state)) return;
    assign(this.__state__, state);
    this.__controller__.add(state);
    return this.__state__;
  };
  Store.prototype.reset = Store.prototype.resetState = function() {
    this.__state__ = {};
    return this.set(this.getInitialState());
  };
  Store.prototype.listen = function(callback) {
    return this.__controller__.stream.listen(callback);
  };
  Store.prototype.listenTo = function(action, onNext, onFail) {
    if (isFunction(action) && isString(action.actionName)) {
      var actionName = action.actionName;
      actionName = actionName[0].toUpperCase() + actionName.slice(1);
      onNext = onNext || this["on" + actionName];
      onFail = onFail || this["on" + actionName + "Fail"];
      if (isFunction(onNext) || isFunction(onFail)) {
        action.listen(onNext && onNext.bind(this), onFail && onFail.bind(this));
      }
    }
    if (arguments.length === 1 && (isFunction(action) || isObject(action))) {
      for (var key in action) if (action.hasOwnProperty(key)) {
        this.listenTo(action[key]);
      }
    }
  };
  function assign(obj) {
    if (!isObject(obj) && !isFunction(obj)) {
      return obj;
    }
    var i = 1;
    while (i < arguments.length) {
      var source = arguments[i++];
      for (var property in source) if (source.hasOwnProperty(property)) {
        if (Object.getOwnPropertyDescriptor && Object.defineProperty) {
          var propertyDescriptor = Object.getOwnPropertyDescriptor(source, property);
          Object.defineProperty(obj, property, propertyDescriptor || {});
        } else {
          obj[property] = source[property];
        }
      }
    }
    return obj;
  }
  function extend(child, parent) {
    child.prototype = Object.create(parent.prototype, {
      constructor: {
        value: child,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    child.__proto__ = parent;
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