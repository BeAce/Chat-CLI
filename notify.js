const notifier = require('node-notifier');
const shelljs = require('shelljs');
const nc = new notifier.NotificationCenter();

nc.notify(
  {
    title: 'beace传来一条消息',
    message: '在吗？',
    sound: 'Funk',
    closeLabel: '忽略',
    reply: true,
  },
  function(err, response, metadata) {
    if (err) throw err;
    console.log('nc', metadata);
  }
);

nc.on('click', function (notifierObject, options) {
  shelljs.exec('open /Applications/Utilities/Terminal.app');
});

nc.on('replied', function(obj, options, metadata) {
  console.log('User replied', metadata);
});
