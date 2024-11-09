const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (env) => {

    const config = {
        mode: env.mode,
        entry: path.resolve(__dirname, 'src', 'index.tsx'),
        devServer: {
            static: path.resolve(__dirname, 'public', 'index.html'),
            port: 3001,
            historyApiFallback: true,
            hot: true
        },
        devtool: 'eval-cheap-module-source-map',
        output: {
            path: path.resolve(__dirname, 'build'),
            filename: '[name].[contenthash].js',
            clean: true
        },
        plugins: [new HtmlWebpackPlugin({
            title: 'Авторизация на dynamic',
            template: path.resolve(__dirname, 'public', 'index.html')
        })],
        module: {
            rules: [
                {
                    test: /\.module\.css$/,
                    use: [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true,
                            },
                        },
                    ],
                },
                {
                    test: /\.(ts|tsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/preset-env',
                                '@babel/preset-typescript',
                                [
                                    '@babel/preset-react',
                                    {
                                        runtime: 'automatic'
                                    }
                                ]
                            ]
                        }
                    }
                }
            ]
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js']
        }
    };

    return config;

}
