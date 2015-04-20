Flux.ListenerMixin = {
	subscriptions: [],

	listenTo: function (stream, listener) {
		this.subscriptions.push(stream.listen(listener))
	},

	componentWillUnmount: function () {
		var i = 0
		while (i < this.subscriptions.length) {
			this.subscriptions[i++]()
		}
	}
}
