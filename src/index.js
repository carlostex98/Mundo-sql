const express = require('express');
const bodyParser = require('body-parser');
const { database } = require('./keys');
const app = express();

app.set('port', 3000);

app.use(require('./routes/index_route'));

app.listen(app.get('port'), () => {
    console.log('Server is in port', app.get('port'));
});