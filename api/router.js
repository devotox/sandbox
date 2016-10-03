'use strict';

const default_route = require('./routes/default');

module.exports = (app) => {
	app.use('/', default_route);
};
