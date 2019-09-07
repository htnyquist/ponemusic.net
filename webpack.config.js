const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const pages = ['index', 'browse', 'contribute', 'faq', 'soon'];
const pageTemplatePlugins = pages.map((page) =>
    new HtmlWebpackPlugin({
        filename: page+'.html',
        template: path.resolve(__dirname, 'src', page+'.html'),
        chunks: ['common', page],
        inlineSource: '('+page+'.(css|js)$)|(common.(css|js)$)',
    })
);

const jsFiles = ['common', ...pages];
const jsEntries = jsFiles.reduce((obj, script) => ({
    ...obj,
    [script]: path.resolve(__dirname, 'src', 'js', script + '.js'),
}), {});

module.exports = (env, argv) => ({
    entry: jsEntries,
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
    },
    devServer: {
        contentBase: "dist",
        watchContentBase: true,
        inline: true
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),
        ...pageTemplatePlugins,
        new HtmlWebpackInlineSourcePlugin(HtmlWebpackPlugin),
        new CopyPlugin([
            { from: 'src/sitemap.xml' },
            { from: 'src/assets/', to: 'assets/' },
        ]),
    ],
    module: {
        rules: [
            {
                test: /\.(scss)$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: process.env.NODE_ENV === 'development',
                        },
                    },
                    {
                        // Interprets `@import` and `url()` like `import/require()` and will resolve them
                        loader: 'css-loader',
                        options: { url: false }
                    },
                    {
                        // Loader for webpack to process CSS with PostCSS
                        loader: 'postcss-loader',
                        options: {
                            plugins: [
                                require('precss')(),
                                require('autoprefixer')(),
                                require('cssnano')()
                            ]
                        }
                    },
                    {
                        // Loads a SASS/SCSS file and compiles it to CSS
                        loader: 'sass-loader'
                    }
                ]
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: {
                            minimize: argv.mode === 'production'
                        },
                    },
                    {
                        loader: 'posthtml-loader',
                        options: {
                            plugins: [
                                require('posthtml-include')({
                                    root: path.resolve(__dirname, 'src')
                                })
                            ]
                        }
                    }
                ]
            }
        ]
    }
});