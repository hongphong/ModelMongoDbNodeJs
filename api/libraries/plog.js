/*
 * @Author: Phong Pham Hong 
 * @Date: 2018-03-01 15:39:06 
 * @Last Modified by: Phong Pham Hong
 * @Last Modified time: 2018-06-22 11:17:59
 * 
 * Method output logging for whole projects
 */

var bunyan = require('bunyan');

var logger = bunyan.createLogger({
    name: 'Application Log',
    streams: [
        {
            level: 'info',
            path: project_settings.logger.logRunningFile,
            type: 'rotating-file',
            period: project_settings.logger.rotatingFile.info.period,
            count: project_settings.logger.rotatingFile.info.count
        },
        {
            level: 'error',
            path: project_settings.logger.logErrorFile,

            type: 'rotating-file',
            period: project_settings.logger.rotatingFile.error.period,
            count: project_settings.logger.rotatingFile.error.count
        },
    ],

});


var log = function (msg, level = 'info', title = "") {
    if (project_settings.ENV == "dev") {
        console.log("[DEV-MODE: CONSOLE " + level.toUpperCase() + "] " + title, msg)
        return true;
    }
    switch (level) {
        case "info":
            if (title == "")
                msg = "[LOG " + level.toUpperCase() + "] " + JSON.stringify(msg)
            else
                msg = {
                    "title": title,
                    "message": msg
                }
            logger.info(msg)
            break;
        case "error":
            if (title == "")
                msg = "[LOG " + level.toUpperCase() + "] " + JSON.stringify(msg)
            else
                msg = {
                    "title": title,
                    "message": msg
                }
            logger.error(msg)
            break;
    }
}


module.exports = {
    log: log,
    error: function (msg, title = "") {
        log(msg, 'error', title)
    }
};