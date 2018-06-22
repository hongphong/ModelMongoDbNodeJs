/*
 * @Author: Phong Pham Hong 
 * @Date: 2018-04-09 15:34:16 
 * @Last Modified by: Phong Pham Hong
 * @Last Modified time: 2018-04-09 17:08:55
 * 
 * Init service with cluster mode
 * Number processes is equal with number CPU cores
 */

var chalk = require("chalk");
var cluster = require("cluster");
var os = require("os");
var settings = require('./config/settings')();
// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //
if (cluster.isMaster) {
    console.log(chalk.red("[Cluster]"), "Master process start:", process.pid);
    var maxNumberProcess = os.cpus().length;
    maxNumberProcess = maxNumberProcess <= settings.MAXIMUM_SERVICE_PROCESSES ? maxNumberProcess : settings.MAXIMUM_SERVICE_PROCESSES;
    console.log(chalk.red("[Cluster]"),"The number of processes: " + maxNumberProcess);
    for (var i = 0, coreCount = maxNumberProcess; i < coreCount; i++) {
        var worker = cluster.fork();
    }
    cluster.on(
        "exit",
        function handleExit(worker, code, signal) {
            console.log(chalk.yellow("[Cluster]"), "Worker exit:", worker.process.pid);
            console.log(chalk.yellow("[Cluster]"), "Worker end:", worker.exitedAfterDisconnect);
            if (!worker.exitedAfterDisconnect) {
                var worker = cluster.fork();
            }
        }
    );
} else {
    require("./server");
    console.log(chalk.red("[Worker]"), "Worker start: ", process.pid);
}