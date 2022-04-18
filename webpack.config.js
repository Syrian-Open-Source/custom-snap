const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	mode: "production",
	entry: "./docs/src/index.js",
	output: {
		filename: "index.js",
		path: path.resolve(__dirname, "docs"),
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "docs/src/index.html",
			title: "custom-snap.js - Snap and normal scrolling at once"
		})
	]
};
