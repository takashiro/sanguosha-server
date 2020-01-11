const path = require('path');

module.exports = function (env, argv) {
	const mode = (argv && argv.mode) || 'production';
	return {
		mode,
		target: 'node',
		entry: {
			app: './src/index.ts',
		},
		module: {
			rules: [
				{
					test: /\.ts$/,
					use: 'ts-loader',
					exclude: /node_modules/,
					parser: {
						commonjs: false,
					},
				},
			],
		},
		resolve: {
			extensions: [
				'.ts',
			],
		},
		output: {
			filename: '[name].js',
			path: path.join(__dirname, 'dist'),
			devtoolModuleFilenameTemplate : '[absolute-resource-path]',
		},
		devtool: mode !== 'production' ? 'source-map' : undefined,
	};
};
