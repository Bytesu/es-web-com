const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path');

module.exports = {
    mode: 'production',
    // mode: 'development',
    entry: './src/index.js',
    devtool: "inline-source-map",
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundl1e.js'
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {loader: 'style-loader'},
                    {loader: 'css-loader'}
                ]
            },
            {
                test: /\.jsx?$/,
                loader: 'babel-loader'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin()
    ]
}
