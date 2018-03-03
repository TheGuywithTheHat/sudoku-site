const path = require('path');
const express = require('express');
const expressStaticGzip = require('express-static-gzip');

const app = express();

const sudokuWSHandler = require('./server/sudoku.js')(app);

app.use('/', expressStaticGzip(path.join(__dirname, 'build')));
app.ws('/socket', sudokuWSHandler);

app.listen(4200, () => {
    console.log('listening at http://localhost:4200');
});