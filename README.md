# Meteor Streams

### DB less realtime communication for meteor

Forked from [lepozepo's version](https://github.com/Lepozepo/meteor-streams).

Added ability to specify connection in options on client, e.g,

    var connection = DDP.connection('http://some-different-meteor-server')

    stream = new Meteor.Stream('streamName', {connection: connection});

