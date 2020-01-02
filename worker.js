const amqp = require('amqplib/callback_api');
const CONN_URL = require('./config/urls.js').cloudamqp;
const { trecs } = require('./app');

amqp.connect(CONN_URL, function (err, conn) {
  if (err) {
	console.log('Error: ', err);
  };
  conn.createChannel(function (err, ch) {
	let reco;
    ch.consume('virtualgroove-app', async function (msg) {
	  console.log('.....');
	  reco = await trecs(msg);
	  console.log('reco', reco);
	  ch.sendToQueue('t-recs', new Buffer.from(reco));
      },{ noAck: true }
	);
  });
});
