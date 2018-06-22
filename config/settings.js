/*
 * @Author: Phong Pham Hong 
 * @Date: 2018-04-04 15:10:20 
 * @Last Modified by: Phong Pham Hong
 * @Last Modified time: 2018-06-22 11:31:39
 * 
 * Settings for projects
 */

module.exports = function () {
    /**
     * config enviroment
     * dev: deverloper enviroment
     * prod: production enviroment
     */
    this.ENV = "dev";

    /**
     * some configs for enviroment
     */
    this.UV_THREADPOOL_SIZE = 10;
    this.MAXIMUM_SERVICE_PROCESSES = 6;
    /**
     * config database 
     */
    this.database = {
        "mongodb": {
            "singeletonCollection": true,
            "main": {
                "uri": "mongodb://192.168.4.38:27017,192.168.4.39:27017",
                // "options": {
                //     "maxPoolSize": 200
                // }
            },
            "other_host": {
                "uri": "mongodb://192.168.4.39:27017,192.168.4.38:27017"
            }
        }
    }
    /**
     * config server host, port
     */
    this.server = {
        "host": "192.168.4.174",
        "port_ssl": 3001,
        "port": 3000,
        // "domain_tracking": "tracking.devmetrixa.com",f
        "ipfilter": []

    }
    /**
     * config ssl
     */
    this.ssl = {
        // key: './sslcert/key.pem',
        // cert: './sslcert/cert.pem',
        // passphrase: '<your pass>'
    }

    /**
     * config log
     */
    this.logger = {
        logErrorFile: 'D:/var/nodejs/log/error.log',
        logRunningFile: 'D:/var/nodejs/log/running.log',
        rotatingFile: {
            info: {
                period: '1d',
                count: 14
            },
            error: {
                period: '1d',
                count: 14
            },
            trackingResult: {
                period: '1d',
                count: 365
            },
            trackingTwilioResult: {
                period: '1d',
                count: 365
            }
        }
    }


    /**
     * return settings
     */
    return this
}   