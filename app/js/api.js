const axios = require('axios');
const Promise = require('bluebird');

const methods = [
	'get', 'post', 'put', 'patch',
	'delete', 'head', 'options'
];

const config = require('./config');

const baseURL = config.api.base;
const apiPrefix = config.api.prefix;

const request = (method, api, params, data, headers) => {
	let url = `${baseURL}/${apiPrefix}/${api}`;
	let config = { method, url, params, data, headers };

	return new Promise((resolve, reject) => {
		axios(config).then((response) => {
			resolve(response.data);
		}).catch((response) => {
			reject(response.data);
		});
	});
};

module.exports = request;

methods.forEach((method) => {
	module.exports[method] = function() {
		return request(method, ...arguments);
	};
});
