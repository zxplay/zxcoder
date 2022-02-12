const webpack = require("webpack");

module.exports = [
    {
        output: {
            path: __dirname + '/public/dist',
            filename: 'jsspeccy.js',
        },
        name: 'jsspeccy',
        entry: './src/runtime/jsspeccy.js',
        mode: 'production',
        module: {
            rules: [
                {
                    test: /\.svg$/,
                    loader: 'svg-inline-loader',
                }
            ],
        }
    },
    {
        output: {
            path: __dirname + '/public/dist',
            filename: 'jsspeccy-worker.js',
        },
        name: 'worker',
        entry: './src/runtime/worker.js',
        mode: 'production',
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
                    type: 'asset/inline'
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
