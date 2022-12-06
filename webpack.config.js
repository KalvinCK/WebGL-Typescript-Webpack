const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const { config } = require("process");

module.exports =
{
    mode: "development",
    entry: 
    {
        index: "./src/Main.ts"
    },
    devtool: 'inline-source-map',
    devServer: 
    {
        static: "./dist",
    },
    plugins: 
    [
        new HtmlWebpackPlugin({
          title: 'WebGL APP',
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
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
          },
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
    resolve: 
    {
      extensions: ['.tsx', '.ts', '.js'],
    },
    optimization:
    {
        runtimeChunk: "single",
    },
};

// npm run server