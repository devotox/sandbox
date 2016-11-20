// Configure PM2 Keymetrics ( must come before requiring any http modules )
let pmx 					= require('pmx').init({ http : true });

let fs						= require('fs');
let cors					= require('cors');
let path					= require('path');
let http					= require('http');
let https					= require('https');
let Promise					= require('bluebird');

let helmet 					= require('helmet');
let express					= require('express');
let compression				= require('compression');
let bodyParser				= require('body-parser');
let methodOverride			= require('method-override');
//let forceSSL 				= require('express-force-ssl');

// Configure PG (allow named parameters in stored procedures)
require('pg-spice').patch(require('pg'));

// Configure Bluebird Promise Library
Promise.config({
	monitoring: false,
	cancellation: true,
	longStackTraces: true
});

// setup the server configuration based on environment / command-line options
let port = process.env.NODE_PORT || process.env.PORT || 8080;
let host = process.env.NODE_HOST || process.env.HOST || 'localhost';
let secure_port = process.env.NODE_SECURE_PORT || process.env.SECURE_PORT || 3000;

let configuration = {
	host: host,
	port: port,
	version: '1',
	secure_port: secure_port
};

let certificates = {
	private_key_path: path.join(__dirname, '../sslcert/server.key'),
	certificate_path: path.join(__dirname, '../sslcert/server.crt'),

	ca1_path: path.join(__dirname, '../sslcert/bundle_1.crt'),
	ca2_path: path.join(__dirname, '../sslcert/bundle_2.crt'),
	ca3_path: path.join(__dirname, '../sslcert/bundle_3.crt')
};

// configure the SSL certificates
let privateKey	= fs.readFileSync(certificates.private_key_path, 'utf8');
let certificate = fs.readFileSync(certificates.certificate_path, 'utf8');

let certificate_authorities = [
	fs.readFileSync(certificates.ca1_path, 'utf8'),
	fs.readFileSync(certificates.ca2_path, 'utf8'),
	fs.readFileSync(certificates.ca3_path, 'utf8')
];

let credentials = {
	key: privateKey,
	cert: certificate,
	ca: certificate_authorities
};

global.configuration = configuration;
global.version = configuration.version;

// ========================================================= CONFIGURE EXPRESS ======================================================= //

// create the express framework
let app = express();

// Serve static files
app.set('view engine', 'ejs');
app.set('port', configuration.port);
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, '../dist')));

// override with different headers; last one takes precedence
app.use(methodOverride('X-HTTP-Method', ['POST', 'PUT']));          // Microsoft
app.use(methodOverride('X-Method-Override', ['POST', 'PUT']));      // IBM
app.use(methodOverride('X-HTTP-Method-Override', ['POST', 'PUT'])); // Google / GData / Salesforce

// Force SSL
// app.use(forceSSL);
// app.set('forceSSLOptions', {
// 	httpsPort: configuration.secure_port
// });

// Protect against known vulnerabilities
app.use(helmet());
app.use(helmet.noCache());

app.use(cors());
app.use(compression());
app.use(express.query());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

app.use(pmx.expressErrorHandler());

// start the app!
require('./router')(app); // Set all routes in router.js file
module.exports.server = https.createServer(credentials, app);
module.exports.server.listen(configuration.secure_port);
http.createServer(app).listen(configuration.port);

console.info(`API LISTENING ON...`);
console.info(`HOST: ${configuration.host}`);
console.info(`PORT: ${configuration.port}`);
console.info(`SECURE PORT: ${configuration.secure_port}`);

// handle errors
process.on('uncaughtException', (error) => {
	console.log('\n============================ !!!!! ERROR !!!!! ===============================\n');
	console.error('Uncaught Exception:', error.message);
	console.error(error.stack);
	console.log('\n============================ !!!!! ERROR !!!!! ===============================\n');

	pmx.notify(error);
	process.exit(1);
});
