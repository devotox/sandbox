'use strict';

const request = require('axios');

const express = require('express');

const router = express.Router();

router.post('/', (req, res) => {
	if(!req.body.url) {
		return res.send('');
	}
	
	request({
		url: req.body.url,
		data: req.body.data || {},
		params: req.body.params || {},
		headers: req.body.headers || {},
		method: req.body.method || 'GET'
	})
	.then((response) => {
		res.send(response.data);
	})
	.catch(() => {
		res.send('');
	});
});

module.exports = router;
