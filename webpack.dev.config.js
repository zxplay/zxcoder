const webpack = require("webpack");

module.exports = [
    {
        name: 'worker',
        mode: 'development',
        devtool: 'source-map',
        output: {
            path: __dirname + '/public/dist',
            filename: 'jsspeccy-worker.js',
        },
        entry: './src/emulator/worker.js'
    },
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
                    use: 'svg-inline-loader'
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
