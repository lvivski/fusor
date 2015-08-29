(function(root) {
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
    Promise = root.Davy;
    Observable = root.Streamlet;
    root.Fusor = Flux;
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
  Flux.createAction = function(actionType, handler) {
    if (!isFunction(handler)) {
      handler = identity;
    }
    var controller = Observable.control(), stream = controller.stream, next = function(value) {
      controller.next(value);
      return value;
    }, fail = function(error) {
      controller.fail(error);
      throw error;
    }, action = function Action() {
      var args = arguments, ctx = this;
      return new Promise(function(resolve) {
        resolve(handler.apply(ctx, args));
      }).then(next, fail);
    }, extra = {
      actionType: actionType,
      stream: stream
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
        var value = spec[action], actionType = isString(value) ? value : action;
        var parentActionType = parent + actionType;
        if (isObject(value)) {
          var handler = value.$;
          delete value.$;
          actions[actionType] = assign(this.createAction(parentActionType, handler), this.createActions(value, parentActionType));
        } else {
          actions[actionType] = this.createAction(parentActionType, value);
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
  Flux.replay = Flux.replayActions = function(actions) {
    return Promise.all(actions);
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
    listenTo: function(store, listener) {
      this.subscriptions.push(store.stream.listen(listener));
    }
  };
  function Actions() {
    var proto = this.constructor.prototype;
    for (var name in proto) if (proto.hasOwnProperty(name)) {
      if (name !== "constructor" && isFunction(this[name])) {
        this[name] = Flux.createAction(name, this[name]);
      }
    }
  }
  function Store() {
    this.initialState || (this.initialState = {});
    var controller = Observable.control(true);
    this.stream = controller.stream;
    this.add = controller.add.bind(controller);
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
    this.add(state);
    return assign(this.__state__, state);
  };
  Store.prototype.reset = Store.prototype.resetState = function() {
    this.__state__ = {};
    return this.set(this.getInitialState());
  };
  Store.prototype.listenTo = function(action, onNext, onFail) {
    if (isFunction(action) && isString(action.actionType)) {
      var actionType = action.actionType;
      actionType = actionType[0].toUpperCase() + actionType.slice(1);
      onNext = onNext || this["on" + actionType];
      onFail = onFail || this["on" + actionType + "Fail"];
      if (isFunction(onNext) || isFunction(onFail)) {
        action.stream.listen(onNext && onNext.bind(this), onFail && onFail.bind(this));
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
  function identity(_) {
    return _;
  }
})(Function("return this")());