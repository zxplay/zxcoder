const webpack = require("webpack");

module.exports = [
    {
        name: 'worker',
        mode: 'production',
        output: {
            path: __dirname + '/public/dist',
            filename: 'jsspeccy-worker.js',
        },
        entry: './src/emulator/worker.js'
    },
    {
        mode: 'production',
        devtool: false,
        output: {
            path: __dirname + '/public/dist',
            filename: 'bundle.js'
        },
        entry: './es5/index',
        module: {
            rules: [
                {
                    test: /\.(s?)css$/i,
                    use: ['style-loader', 'css-loader', 'sass-loader'],
                },
                {
                    test: /\.svg/,
                    use: 'svg-inline-loader'
                }
            ]
        },
        plugins: [
            new webpack.DefinePlugin({
                STAGING_ENV: JSON.stringify('prod')
            })
        ],
        performance: {hints: false}
    }
];
