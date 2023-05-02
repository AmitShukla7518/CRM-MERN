const express = require('express');
const app = express()
require('custom-env').env(true)
const port = process.env.port;
const bodyParser = require('body-parser')
const router = require("./Route/route");
var multer = require('multer');
const cors = require('cors');
var fileupload = require("express-fileupload");
var logger = require('./config/winston');
const cores = require('cors');

// app.use(bodyParser.json({ limit: '50mb' }));
// app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 1000000 }));
// app.use(fileupload());

app.use(cores());
app.use('/public/logo',express.static('public/logo'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({
    type: ["application/x-www-form-urlencoded","application/json"],
}));

app.use(function (req, res, next) {
    //set headers to allow cross origin request.
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With,Authorization,Referer,User-Agent, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    next();
});


var server = app.listen(port, () => {
    logger.info(`App running on port ${port}.`);
    // console.log(`App running on port ${port}.`);
})
app.use('/CRM', router);

//response time out(5 minutes -->> 300 seconds -->> 300000 milliseconds)
server.timeout = 300000;