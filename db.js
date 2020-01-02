const { Pool } = require('pg');
const { rds } = require('./config/urls');

const pool = new Pool({
  connectionString: rds
});

module.exports = {
  query: (text, params, cb) => {
	console.log('executed query', text);
	return pool.query(text, params, cb);
  }
};
