const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');

const pages = ['index', 'browse', 'faq'];
const pageTemplatePlugins = pages.map((page) =>
    new HtmlWebpackPlugin({
        filename: page+'.html',
        template: path.resolve(__dirname, 'src', page+'.html'),
        chunks: ['common', page],
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
        ...pageTemplatePlugins,
        //new BundleAnalyzerPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.(scss)$/,
                use: [
                    {
                        // Adds CSS to the DOM by injecting a `<style>` tag
                        loader: 'style-loader'
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