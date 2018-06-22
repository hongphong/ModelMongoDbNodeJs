/*
 * @Author: Phong Pham Hong; 
 * @Date: 2018-03-01 10:06:02 
 * @Last Modified by: Phong Pham Hong
 * @Last Modified time: 2018-04-19 10:50:40
 * 
 * Routes all requests for API
 */
'use strict';
var fs = require('fs');
/** 
 * load config from json file to init controllers, actions
*/
try {
    var pathConfig = './config/config-routes.json';
    var configRouter = JSON.parse(fs.readFileSync(pathConfig, 'utf8'));
} catch (ex) {
    throw new Error('Cannot load config_routes.json to init controllers/actions.');
}
/**
 * read config and require controllers automatically
 * @param {*} app 
 */
module.exports = function (app) {
    Object.keys(configRouter).forEach(function (ctrl) {
        var controllerPath = '../controllers/' + ctrl + '_controller';
        var actions = configRouter[ctrl];
        var controller = require(controllerPath);

        Object.keys(actions).forEach(function (act) {
            var func = actions[act];
            // parsing config
            var funcParser = func.split(':')
            var method_http = funcParser.length > 1 ? funcParser[0].toLowerCase() : 'get'
            var funcStr = funcParser.length > 1 ? funcParser[1] : funcParser[0]
            try {
                plog.log('Start require action: ' + controllerPath + ' Action: ' + act + ' Method: ' + method_http.toUpperCase());
                // start apply action to app
                app.route('/api/' + act)[method_http](controller[funcStr])
            } catch (err) {
                plog.error(err)
                throw new Error('Error when active router: url:' + act + '-> function:' + controllerPath + '/' + funcStr + '. \n Maybe your mapped function is not existed. Please check your router config at: ' + pathConfig)
            }
        })

    })
};


