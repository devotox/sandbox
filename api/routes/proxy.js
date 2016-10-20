const request = require('request');

const express = require('express');

const router = express.Router();

const _ = require('lodash');

router.get('/', (req, res) => {
	res.send('Proxy Needs POST');
});

router.post('/', (req, res) => {
	if(!req.body.url) {
		return res.status(500).send('Need to send a url in the request body');
	}

	let config = Object.assign({
		url: req.body.url,
		aws: req.body.aws,
		auth: req.body.auth,
		form: req.body.form,
		oauth: req.body.oauth,
		method: req.body.method,
		formData: req.body.formData,
		body: req.body.data || null,
		qs: req.body.params || null,
		headers: req.body.headers || null,
		json: _.isObject(req.body.data) ? true : false
	}, req.body.config);

	request(config).pipe(res);
});

module.exports = router;
