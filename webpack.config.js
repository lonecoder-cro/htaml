const path = require('path')
const webpackNodeExternals = require('webpack-node-externals')
const CircularDependencyPlugin = require('circular-dependency-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
// const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
// var ForkTsCheckerNotifierWebpackPlugin = require('fork-ts-checker-notifier-webpack-plugin')


module.exports = {
    mode: 'production',
    context: __dirname,
    target: 'node',
    devtool: 'source-map',
    entry: {
        main: path.resolve(__dirname, 'src/index.ts')
    },
    output: {
        publicPath: 'dist',
        filename: 'htaml.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.ts|js$/,
                include: [path.resolve(__dirname, 'src')],
                exclude: {
                    and: [/node_modules/, /test/, /examples/]
                },
                use: [
                    {
                        loader: 'ts-loader'
                    }
                ]

            },
            {
                test: /\.(?:js)$/,
                exclude: {
                    and: [/node_modules/, /test/, /examples/]
                },
                use:
                {
                    loader: "babel-loader",
                    options: {
                        presets: [['@babel/preset-env', { targets: "defaults", useBuiltIns: false }]],
                        cacheDirectory: true,
                        cacheCompression: true,
                        plugins: [
                            "@babel/plugin-transform-runtime",
                            "babel-plugin-transform-async-to-promises"
                        ]
                    }
                }

            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    externals: [webpackNodeExternals()],
    plugins: [
        //  new ForkTsCheckerWebpackPlugin(),
        // new ForkTsCheckerNotifierWebpackPlugin(
        //     {
        //         title: 'TypeScript',
        //         excludeWarnings: false,
        //         skipSuccessful: false,
        //         skipFirstNotification: false,
        //         alwaysNotify: true,
        //         typescript: {
        //             diagnosticOptions: {
        //                 semantic: true,
        //                 syntactic: true,
        //             },
        //         },
        //     }
        // ),
        new CircularDependencyPlugin({
            exclude: /a\.js|node_modules|test/,
            failOnError: true,
            allowAsyncCycles: false,
            cwd: process.cwd(),

            onDetected({ paths, compilation }) { compilation.errors.push(new Error(paths.join(' -> '))) },
        }),
        new BundleAnalyzerPlugin({ analyzerMode: 'disabled', generateStatsFile: true })
    ],
    watchOptions: {
        // for some systems, watching many files can result in a lot of CPU or memory usage
        // https://webpack.js.org/configuration/watch/#watchoptionsignored
        // don't use this pattern, if you have a monorepo with linked packages
        ignored: /node_modules/,
    },
}
