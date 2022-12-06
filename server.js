const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const app = express();
const config = require('./webpack.config.js');
const compiler = webpack(config);

// Diz ao express para usar o webpack-dev-middleware e usar o webpack.config.js
// arquivo de configuração como base.
app.use(
    webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
  })
);


app.listen(8080, () => 
{
  console.log("server rodando na porta http://localhost:8080");
});

// run server => npm start our npm run server