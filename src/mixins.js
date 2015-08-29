Flux.ListenerMixin = {
	componentWillMount: function () {
		this.subscriptions = []
	},

	componentWillUnmount: function () {
		var i = 0
		while (i < this.subscriptions.length) {
			this.subscriptions[i++]()
		}
	},

	listenTo: function (store, listener) {
		this.subscriptions.push(store.stream.listen(listener))
	}
}
