# Flex

Flexible Flux implementation

##API

####`Flex.createActions(spec)`

####`Flex.createAction(name, fn)`
* `.listen(onSuccess, onFail)`

####`Flex.createStore(spec)`

####`Flex.Store`
* `.getInitialState()`

* `.getState()` & `.get()`

* `.setState()` & `.set()`

* `.resetState()` & `.reset()`

* `.listen(onData)`

* `.initialize()`

* `.listenTo(action[, onSuccess, onFail])`

* `.on<ActionName>()` & `.on<ActionName>Fail()` 

####`Flex.ListenerMixin`
* `.listenTo(store, onData)`

####`Flex.saveState(store)`

####`Flex.restoreState(store, savedState)`

####`Flex.Promise`

####`Flex.Stream`


