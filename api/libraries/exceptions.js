/*
 * @Author: Phong Pham Hong 
 * @Date: 2018-04-19 08:59:37 
 * @Last Modified by: Phong Pham Hong
 * @Last Modified time: 2018-06-22 11:17:38
 * 
 * Define some exception errors for projects
 */


module.exports = {
    ParamsError: function (message, extra) {
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
        this.message = message ? message : "Your params are invalid or missing";
        this.extra = extra;
    }
}