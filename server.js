/**
 * server.js
 *
 * Expressを使用したローカルサーバです。
 */

let express = require('express');
let app = express();
let port = 3000;

app.use(express.static('dest'));
app.listen(port, ()=> {
  console.log('Expressサーバ起動');
});
