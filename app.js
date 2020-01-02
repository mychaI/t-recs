const amqp = require('amqplib/callback_api');
const CONN_URL = require('./config/urls.js').cloudamqp;
const db = require('./db');

module.exports = {
  trecs: async msg => {
	let song;
	let dataset;
	const targetSongValues = [];
	let comparisonSongValues = [];
	const jaccard_coefficients = {};

	const searchTerm = msg.content.toString();
	const songQuery = `
	SELECT * 
	FROM vgclusters 
	WHERE LOWER(title) = LOWER($1)`
	await db.query(songQuery, [searchTerm])
			.then( data => {
			  song = data.rows[0];
			})
			.catch( err => console.log('Error searching song: ', err));

	/*
	console.log('Song: ', song);
	for (let key in song) {
	  if (typeof song[key] === 'number') {
		targetSongValues.push(song[key]);
	  }
	}
	console.log(targetSongValues);
	*/

	const datasetQuery = `SELECT * FROM vgclusters`
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

	for (let i = 0; i < dataset.length; i++) {
	  if (dataset[i]['id'] !== song['id']) {
		let intersection = 0;
		// Initialize union to be the combined # of metrics for target song and comparison song
		// Will subtract the # intersections to get true union amount
		let union = 26;
		for (let key in dataset[i]) {
		  if (dataset[i][key] === song[key]) {
			intersection++;
		  }
		}
		union = union - intersection;
		jaccard_coefficients[dataset[i]['id']] = intersection / union;
	  }
	}
	let max = Number.NEGATIVE_INFINITY;
	let maxId;
	for (let item in jaccard_coefficients) {
	  if (jaccard_coefficients[item] > max) {
		console.log('Setting item id: ', jaccard_coefficients[item]);
		max = jaccard_coefficients[item];
		maxId = item;
	  }
	};

	// return out recommended song title
	return dataset[maxId].title;

	/*
	//for (let i = 0; i < dataset.length; i++) {
	for (let i = 0; i < 4; i++) {
	  if (dataset[i]['id'] !== song['id']) {
		// Create a comparison song array of cluster values
		for (let key in dataset[i]) {
		  if (typeof dataset[i][key] === 'number') {
			comparisonSongValues.push(dataset[i][key]);
		  }
		}
		// Calculate Jaccard Similarity Coefficient
		console.log('Target song: ', targetSongValues);
		console.log('Comparison: ', comparisonSongValues);
		comparisonSongValue = [];
	  }
	};
	*/

  }
}
