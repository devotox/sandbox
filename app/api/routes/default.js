'use strict';

const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
	res.send('GET handler for / route.');
});

module.exports = router;
