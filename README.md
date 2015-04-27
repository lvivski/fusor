# Flex

Flexible Flux implementation

##API

####`Flex.createAction(name[, fn])` 
Creates a new Action. Returns an _Observable/Function_.

* `.listen(onSuccess, onFail)` Subscribe to an _Action_. Returns a function, that will unsubscribe you, once called. `onSuccess` or `onFail` callback will be called depending on the _Action_ result. 

####`Flex.createActions(spec)`
Creates multiple actions based on the provided `spec`. Supports sub-actions: 
```js
var Actions = Flex.createActions({
    Parent: {
        $: function () {}, // optional Parent implementation 
        Child: 'Child',
        Child2: function () {} // optional Child implementation
    },
    Parent2: ['Child3', 'Child4'] // alternative syntax
})
```

Actions can later be used as:
`Actions.Parent()`, `Actions.Parent2.Child3()` etc.

_**Note:** Action call returns a `Promise`, that is resolved with a `function`, that will synchronously propagate changes to subscribed _Store_. 
May be used together with `Promise.all()` in isomorphic apps._

####`Flex.createStore(spec)`
Creates a new _Store_. Returns a `Flex.Store` object. 

* `initialize` method, it will be used as a `constructor`. 
* `initialState` property will be used a _Store_'s initial state.

####`Flex.Store`
* `.getInitialState()` Returns _Store_ initial state

* `.getState()` & `.get()` Returns current state

* `.setState(stateDiff)` & `.set(stateDiff)` Applies `stateDiff` to the current state and propagates it to _Observers_.

* `.resetState()` & `.reset()` Resets state to its original form.

* `.listen(onData)` Subscribes an _Observer_ to _Store_ state changes using `onData` callback.

* `.listenTo(action[, onSuccess, onFail])` Subscribes _Store_ to _`action`_ calls. Optional `onSuccess` and `onFail` methods may be used.

* `.on<`_`ActionName`_`>()` & `.on<`_`ActionName`_`>Fail()` If no callbacks provided in `.listenTo()` method, appropriate _Store_ methods will be used as callbacks.
`ActionName` is formed as (_ParentName_ + _ChildName_): `Parent`, `ParentChild`, `Parent2Child3` etc.


####`Flex.ListenerMixin`
Simplifies _Component_ subscription/unsubscription to _Store_.

* `.listenTo(store, onData)` Subscribes _Component_ to _Store_ changes. Unsubscribes on `componentWillUnmount`.

####`Flex.saveState(store)`
Returns current `store` state as a `JSON` string. 

####`Flex.restoreState(store, savedState)`
Applies `savedState` to `store` and propagates changes to _Components_. May be used in isomorphic apps.

####`Flex.Promise`
Promise constructor

####`Flex.Observable`
Observable constructor


