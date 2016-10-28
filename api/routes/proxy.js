const request = require('request');

const express = require('express');

const router = express.Router();

const _ = require('lodash');

router.all('/', (req, res) => {
	let data = Object.assign({}, req.body, req.query);

	if(!data.url) {
		return res.status(500).send('Need to send a url in the request body');
	}

	let config = Object.assign({
		url: data.url,
		aws: data.aws,
		auth: data.auth,
		form: data.form,
		oauth: data.oauth,
		method: data.method,
		formData: data.formData,
		body: data.data || null,
		qs: data.params || null,
		headers: data.headers || null,
		json: _.isObject(data.data) ? true : false
	}, data.config);

	request(config).pipe(res);
});

module.exports = router;
