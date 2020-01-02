const amqp = require('amqplib/callback_api');
const CONN_URL = require('./config/urls.js').cloudamqp;
const { trecs } = require('./app');

amqp.connect(CONN_URL, function (err, conn) {
  if (err) {
	console.log('Error: ', err);
  };
  conn.createChannel(function (err, ch) {
    ch.consume('virtualgroove-app', function (msg) {
	  console.log('.....');
	  trecs(msg);
      },{ noAck: true }
    );
  });
});
