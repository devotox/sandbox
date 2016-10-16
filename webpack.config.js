module.exports = (source) => {
	return {
		module: {
			entry: [`${source}/js/index.js`],
			preLoaders: [{
				test: /\.jsx?$/,
				exclude: /(node_modules|bower_components|vendor|dist)/,
				loader: 'jshint-loader'
			}],
			loaders: [{
				test: /\.md$/,
				loader: 'null'
			}, {
				test: /\.json$/,
				loader: 'json-loader'
			}, {
				test: /node_modules/,
				loader: 'ify-loader'
			// }, {
			// 	test: /node_modules/,
			// 	loader: 'transform/cacheable?brfs'
			}, {
				test: /\.hbs?$/,
				loader: 'handlebars-template-loader',
				exclude: /(node_modules|bower_components|vendor|dist)/,
				query: {
					helperDirs: [
						`${source}/js/helpers/handlebars`,
					]
				}
			}, {
				test: /\.jsx?$/,
				loader: 'babel-loader',
				exclude: /(node_modules|bower_components|vendor|dist)/,
				query: {
					presets: ['es2015'],
					plugins: ['transform-runtime']
				}
			}]
		},
		output: {
			filename: '[name].js'
		},
		node: {
			fs: 'empty',
			net: 'empty',
			tls: 'empty'
		},
		jshint: {
			emitErrors: true,
			failOnHint: false
		}
	};
};
