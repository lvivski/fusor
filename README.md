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

* `.listenTo(action[, onSuccess, onFail])`

* `.initialize()`

* `.on<EventName>()` & `.on<EventName>Fail()` 

####`Flex.ListenerMixin`
* `.listenTo(store, onData)`

####`Flex.saveState(store)`

####`Flex.restoreState(store, savedState)`

####`Flex.Promise`

####`Flex.Stream`


