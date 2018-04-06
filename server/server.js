const express = require('express');
const bodyParser = require('body-parser');
let route = require('./routes/routes');

const app = express();
const port = process.env.PORT || 3000;

app.use('/', route);

app.listen(port, () => {
    console.log(`listening at ${port}`);
});

