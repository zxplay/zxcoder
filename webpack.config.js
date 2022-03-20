const webpack = require("webpack");
const Config = require("./config.json");

module.exports = [
    {
        name: 'worker',
        mode: 'production',
        output: {
            path: __dirname + '/public/dist',
            filename: 'jsspeccy-worker.js',
        },
        entry: './src/lib/jsspeccy/worker.js'
    },
    {
        mode: 'production',
        devtool: 'source-map',
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
                AUTH_BASE: JSON.stringify(Config.authBase),
                STAGING_ENV: JSON.stringify('prod')
            })
        ],
        performance: {hints: false},
        resolve: {
            alias: {
                fs: false
            }
        }
    }
];
