const path = require('path');
const express = require('express');

const app = express();

app.use('/', express.static(path.join(__dirname, 'build')));

app.listen(4200, () => {
    console.log('listening at http://localhost:3000');
});