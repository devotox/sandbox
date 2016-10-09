module.exports = (source) => {
	'use strict';

	return {
		module: {
			entry: [`${source}/js/index.js`],
			preLoaders: [{
				test: /\.json$/,
				loader: 'json-loader',
			}],
			loaders: [{
				test: /\.md$/,
				loader: 'null'
			}, {
				test: /.jsx?$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
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
		}
	};
};
