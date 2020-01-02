const amqp = require('amqplib/callback_api');
const CONN_URL = require('./config/urls.js').cloudamqp;
const db = require('./db');

module.exports = {
  trecs: async msg => {
	let song;
	let dataset;

	const searchTerm = msg.content.toString();
	const songQuery = `
	SELECT * 
	FROM song_clusters 
	WHERE LOWER(title) = LOWER($1)`
	await db.query(songQuery, [searchTerm])
			.then( data => {
			  song = data.rows;
			})
			.catch( err => console.log('Error searching song: ', err));

	console.log('Song: ', song);

	const datasetQuery = `SELECT * FROM song_clusters`

	await db.query(datasetQuery)
			.then( data => {
			  if (data.rows.length === 0) {
				console.log('No data found');
			  }
			  dataset = data.rows;
			})
			.catch( err => {
			  console.log('Error: ', err);
			});
	//console.log('Dataset: ', dataset);

  }
}
