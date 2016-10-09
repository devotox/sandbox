'use strict';

// Add routes in different files and then set them all up here
const default_route = require('./routes/default');
const proxy = require('./routes/proxy');

module.exports = (app) => {
	app.use('/', default_route);
	app.use('/proxy', proxy);
};
