const child_process = require('child_process');

const buffer_to_string = (data) => {
	return data.toString('utf8');
};

// Nodemon
const nodemon = child_process.spawn('nodemon', [ '--debug', 'app.js' ]);
nodemon.stdout.on('data', (data) => {
	console.log('[ Nodemon ]', buffer_to_string(data));
});

nodemon.stderr.on('data', (data) => {
	console.error('[ Nodemon ][ Error ]', buffer_to_string(data));
});

// Node Inspector
const inspector = child_process.spawn('node-inspector', [ '--web-port', '9999' ]);
inspector.stdout.on('data', (data) => {
	console.log('[ Node-Inspector ]', buffer_to_string(data));
});

inspector.stderr.on('data', (data) => {
	console.error('[ Node-Inspector ][ Error ]', buffer_to_string(data));
});
