const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports =
{
    mode: "development",
    entry: 
    {
        index: "./src/Main.js"
    },
    devtool: 'inline-source-map',
    devServer: 
    {
        static: "./dist",
    },
    plugins: 
    [
        new HtmlWebpackPlugin({
          title: 'Development',
        }),
    ],
    output: 
    {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        publicPath: "/",
    },
    module: {
        rules: [
          {
            test: /\.css$/i,
            use: ['style-loader', 'css-loader'],
          },
          {
            test: /\.(png|svg|jpg|jpeg|gif)$/i,
            type: 'asset/resource',
          },
          {
            test: /\.(txt|glsl|webgl|vert|frag)$/,
            use: 'raw-loader'
          }
        ],
    },
    optimization:
    {
        runtimeChunk: "single",
    },
};
// npm run server