const path = require('path');

module.exports = function (env, argv) {
	const mode = (argv && argv.mode) || 'production';
	return {
		mode,
		target: 'node',
		entry: {
			index: './src/index.ts',
		},
		module: {
			rules: [
				{
					test: /\.ts$/,
					exclude: /node_modules/,
					use: 'ts-loader',
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
			libraryExport: 'default',
			libraryTarget: 'commonjs2',
			devtoolModuleFilenameTemplate: '[absolute-resource-path]',
		},
		devtool: mode !== 'production' ? 'source-map' : undefined,
	};
};
