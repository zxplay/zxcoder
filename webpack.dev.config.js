const webpack = require("webpack");

module.exports = [
/*
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
*/
    {
        mode: 'development',
        devtool: 'source-map',
        output: {
            path: __dirname + '/public/dist',
            filename: 'bundle.js'
        },
        entry: './src/index',
        devServer: {
            port: 3000,
            historyApiFallback: true,
            devMiddleware: {
                writeToDisk: true
            }
        },
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/preset-env',
                                '@babel/preset-react'
                            ],
                            plugins: [
                                '@babel/plugin-transform-runtime'
                            ]
                        }
                    }
                },
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
                STAGING_ENV: JSON.stringify('dev')
            })
        ],
        performance: {hints: false}
    }
];
