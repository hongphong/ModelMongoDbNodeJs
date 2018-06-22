/*
 * @Author: Phong Pham Hong; 
 * @Date: 2018-03-01 10:01:26 
 * @Last Modified by: Phong Pham Hong
 * @Last Modified time: 2018-06-22 11:30:51
 */

var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    utilities = require('./api/libraries/utilities'),
    bodyParser = require('body-parser'),
    requestIp = require('request-ip'),
    exception = require('./api/libraries/exceptions'),
    fs = require('fs'),
    ipfilter = require('express-ipfilter').IpFilter;
    

// init setting for projects
global.project_settings = require('./config/settings')();

// set process settings
process.env.UV_THREADPOOL_SIZE = project_settings.UV_THREADPOOL_SIZE;

// load utilities functions
global.utilities = utilities;

// load defined exceptions
global.exception = exception;

// init log function into global variable
global.plog = require('./api/libraries/plog');

// init require function into global variable
global.requireModel = function (path) {
    return require('./api/models/' + path.replace('model', '') + '_model')
}
global.requireLib = function (path) {
    return require('./api/libraries/' + path)
}

// ad request id for dev enviroment
if (project_settings.ENV == "dev") {
    var addRequestId = require('express-request-id')();
    app.use(addRequestId);
}
// ip filter
app.use(ipfilter(project_settings.server.ipfilter));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
/**
 * Middleware for each request
 */
app.use(function (req, res, next) {
    function unhandledRejection(reason, p) {
        plog.error('Possibly Unhandled Rejection.\nReason: ' + reason);
        res.status(500);
        var mes = {
            "status": 500,
            "error": reason.message,
            "mesasge": "Internal server error"
        }
        if (project_settings.ENV == "dev") {
            mes.debug = reason.stack;
        }
        res.json(mes);
    }

    process.on('unhandledRejection', unhandledRejection);

    // Manage to get information from the response too, just like Connect.logger does:
    var end = res.end;
    res.end = function (chunk, encoding) {
        // Prevent MaxListener on process.events
        process.removeListener('unhandledRejection', unhandledRejection);
        res.end = end;
        res.end(chunk, encoding);
    };

    // console log for each request
    reidIfo = ''
    referderInfo = ''
    if (project_settings.ENV == "dev") {
        reidIfo = '[ID: ' + req.id + '] '
        referderInfo = '\n[REFERER]: ' + req.headers.referer;
    }
    plog.log(reidIfo + ' [IP_ADRESS: ' + requestIp.getClientIp(req) + '] - ' + req.method + ' - ' + req.url + referderInfo);
    next();
});
// init router object
var routes = require('./api/routes/apiroutes');
routes(app);

// set default router for API
app.get('/', function (req, res) {
    res.json({ message: 'hooray! welcome to Metrixa api!' });
});

// set media file
app.use("/public", express.static(__dirname + '/public'));
var http = require('http');
var https = require('https');


// listen in http
http.createServer(app).listen(project_settings.server["port"], project_settings.server["host"]);

if (project_settings.server["port"] != project_settings.server["port_ssl"] && !utilities.objectIsEmpty(project_settings.ssl)) {
    plog.log("Create https listening with port: " + project_settings.server["port_ssl"])
    // setup SSL
    var sslOptions = {
        key: fs.readFileSync(project_settings.ssl.key),
        cert: fs.readFileSync(project_settings.ssl.cert),
        passphrase: project_settings.ssl.passphrase
    };
    // listen in https
    https.createServer(sslOptions, app).listen(project_settings.server["port_ssl"], project_settings.server["host"]);
}


console.log('Metrixa API started with info: ', project_settings.server);