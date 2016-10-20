const request = require('axios');

const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
	res.send('Proxy Needs POST');
});

router.post('/', (req, res) => {
	if(!req.body.url) {
		return res.status(500).send('Need to send a url in the request body');
	}

	request({
		url: req.body.url,
		method: req.body.method,
		data: req.body.data || null,
		params: req.body.params || null,
		headers: req.body.headers || null
	})
	.then((response) => {
		let status = (response && response.status) || 200;
		res.status(status).send(response.data);
	})
	.catch((error) => {
		let data = (error && error.response && error.response.data) || error;
		let status = (error && error.response && error.response.status) || 500;
		res.status(status).send(data);
	});
});

module.exports = router;
