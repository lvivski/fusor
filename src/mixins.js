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

	listenTo: function (stream, listener) {
		this.subscriptions.push(stream.listen(listener))
	}
}
