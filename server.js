require('rootpath')();
const express = require('express');
const app = express();
app.use('/uploaded', express.static('uploaded'));
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('_helpers/jwt');
const errorHandler = require('_helpers/error-handler');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors()); 

app.use(jwt());
app.use('/users', require('./users/users.controller'));
app.use(errorHandler);

app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
