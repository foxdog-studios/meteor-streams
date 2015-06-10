Meteor.Stream = function Stream(name, _callback, _options) {
  EV.call(this);

  var callback;
  var options;
  var connection;

  if (typeof _callback === 'function') {
    callback = _callback;
    if (typeof _options === 'object') {
      options = _options;
    }
  } else if (typeof _callback === 'object') {
    options = _callback;
  }

  if (options && options.connection) {
    connection = options.connection;
  }

  var self = this;
  var streamName = 'stream-' + name;

  var collectionOptions = {}
  if (connection) {
    collectionOptions.connection = connection;
  }
  var collection = new Meteor.Collection(streamName, collectionOptions);

  var subscription;
  var subscriptionId;

  var connected = false;
  var pendingEvents = [];

  self._emit = self.emit;

  collection.find({}).observe({
    "added": function(item) {
      if(item.type == 'subscriptionId') {
        subscriptionId = item._id;
        connected = true;
        pendingEvents.forEach(function(args) {
          self.emit.apply(self, args);
        });
        pendingEvents = [];
      } else {
        var context = {};
        context.subscriptionId = item.subscriptionId;
        context.userId = item.userId;
        self._emit.apply(context, item.args);
      }
    }
  });


  // By using Meteor.subscribe, Meteor.call etc. we use the default connection,
  // if a connection was specified in the options we use that instead.
  var ddpConnection = Meteor;
  if (connection) {
    ddpConnection = connection;
  }

  subscription = ddpConnection.subscribe(streamName, callback);

  self.emit = function emit() {
    if(connected) {
      ddpConnection.call(streamName, subscriptionId, arguments);
    } else {
      pendingEvents.push(arguments);
    }
  };

  self.close = function close() {
    subscription.stop();
  };
}

_.extend(Meteor.Stream.prototype, EV.prototype);
