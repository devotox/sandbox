let dns = require('dns');
dns._lookup = dns.lookup;

let cache = {};
setInterval( () => { cache = {}; }, 24 * 60 * 60 * 1000 );

dns.lookup = (domain, family, done) => {
	if (!done) {
		done = family;
		family = null;
	}

	let key = domain;
	if (key && key in cache) {
		let ip = cache[key],
			ipv = ip.indexOf('.') !== -1 ? 4 : 6;

		return process.nextTick(() => {
			done(null, ip, ipv);
		});
	}

	dns._lookup(domain, family, (err, ip, ipv) => {
		if (err) { return done(err); }
		cache[key] = ip;
		done(null, ip, ipv);
	});
};
