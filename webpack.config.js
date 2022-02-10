module.exports = [
    {
        output: {
            path: __dirname + '/public/dist',
            filename: 'jsspeccy.js',
        },
        name: 'jsspeccy',
        entry: './runtime/jsspeccy.js',
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
        entry: './runtime/worker.js',
        mode: 'production',
    },
];
