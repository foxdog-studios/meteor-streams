Package.describe({
  summary: "DB less realtime communication for meteor",
  version:"0.2.0",
  name:"fds:streams",
  git:"https://github.com/Lepozepo/meteor-streams"
});

Package.on_use(function (api, where) {
  api.versionsFrom('METEOR@0.9.0');

  api.use('underscore', ['client', 'server']);
  api.add_files(['lib/ev.js', 'lib/server.js', 'lib/stream_permission.js'], 'server');
  api.add_files(['lib/ev.js', 'lib/client.js'], 'client');
});
