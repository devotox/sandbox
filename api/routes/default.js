const package_json = require('../../package');

const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
	res.json({
		name: package_json.name,
		version: package_json.version,
		license: package_json.license
	});
});

module.exports = router;
