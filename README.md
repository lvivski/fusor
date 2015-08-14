# Fusor

Flexible Flux implementation

## API

#### `Fusor.createAction(name[, fn])` 
Creates a new _Action_. Returns an _Observable/Function_.

* `.listen(onSuccess, onFail)` Subscribe to an _Action_. Returns a function, that will unsubscribe you, once called. `onSuccess` or `onFail` callback will be called depending on the _Action_ result. 

#### `Fusor.createActions(spec)`
Creates multiple actions based on the provided `spec`. Supports sub-actions: 
```js
var Actions = Fusor.createActions({
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

_**Note:** Action call returns a `Promise`. They can be chained as regular promises for sequential action chains._

#### `Fusor.createStore(spec)`
Creates a new _Store_. Returns a `Fusor.Store` object. 

* `initialize` method, it will be used as a `constructor`. 
* `initialState` property will be used a _Store_'s initial state.

#### `Fusor.Store`
Store constructor, extend it to create a new _Store_ using ES6 syntax

* `.getInitialState()` Returns _Store_ initial state

* `.getState()` & `.get()` Returns current state

* `.setState(stateDiff)` & `.set(stateDiff)` Applies `stateDiff` to the current state and propagates it to _Observers_.

* `.resetState()` & `.reset()` Resets state to its original form.

* `.listen(onData)` Subscribes an _Observer_ to _Store_ state changes using `onData` callback.

* `.listenTo(action[, onSuccess, onFail])` Subscribes _Store_ to _`action`_ calls. Optional `onSuccess` and `onFail` methods may be used.

* `.on<`_`ActionName`_`>()` & `.on<`_`ActionName`_`>Fail()` If no callbacks provided to `.listenTo()` method, appropriate _Store_ methods will be used as callbacks.
`ActionName` is formed as (_ParentName_ + _ChildName_): `Parent`, `ParentChild`, `Parent2Child3` etc.

#### `Fusor.Actions`
Actions constructor, extend it to create a new _Actions_ using ES6 syntax

#### `Fusor.ListenerMixin`
Simplifies _Component_ subscription/unsubscription to _Store_.

* `.listenTo(store, onData)` Subscribes _Component_ to _Store_ changes. Unsubscribes on `componentWillUnmount`.

#### `Fusor.saveState(store)`
Returns current `store` state as a `JSON` string. 

#### `Fusor.restoreState(store, savedState)`
Applies `savedState` to `store` and propagates changes to _Components_. Can be used for server-side rendering.

#### `Fusor.replay(actions)` & `Fusor.replayActions(actions)`
Runs a sequence of _Actions_ and returns a promise that will be resolved, when they all finish running.

#### `Fusor.Promise`
Promise constructor

#### `Fusor.Observable`
Observable constructor


