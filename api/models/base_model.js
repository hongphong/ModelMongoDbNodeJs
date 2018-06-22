/*
 * @Author: Phong Pham Hong 
 * @Date: 2018-03-02 09:21:17 
 * @Last Modified by: Phong Pham Hong
 * @Last Modified time: 2018-06-22 11:27:43
 * 
 * Base Class model 
 */
'use strict';
const mongoDb = requireLib('db/mongodbconnection');

class baseModel {

    constructor() {
        this.data = {};
        this.collectionName = '';
        this.databaseName = '';
        this.mongoDbHost = 'main'
    }

    /**
     * define some basic validate for some properties
     * Ex:
     *  'databaseName': ['require','int']
     * list rules:
     *   require, int, float, namespace
     */
    get rules() {
        return {}
    }
    /**
     * get error value
     */
    get error() {
        if (this.__error) {
            return this.__error;
        }
        return {}
    }
    /**
     * set error value
     */
    setError(property, message) {
        if (!this.__error) {
            this.__error = {}
        }
        var listMes = this.__error[property];
        if (!listMes) {
            listMes = [];
        }
        listMes.push(message);
        this.__error[property] = listMes
        return this
    }

    /**
     * validate properties that defined rules on rules()
     * return boolen
     */
    validateProperties() {
        for (var pro in this.rules) {
            var conf = this.rules[pro];
            for (let i in conf) {
                let r = conf[i];
                if (r == 'require' && this[pro] !== 0 && !this[pro]) {
                    this.setError(pro, "Property " + pro + " is required.")
                }
                if (r == 'int' && this[pro] && !utilities.validateIsInt(this[pro])) {
                    this.setError(pro, "Property " + pro + " is not integer.")
                }
                if (r == 'float' && this[pro] && !utilities.validateIsFloat(this[pro])) {
                    this.setError(pro, "Property " + pro + " is not float.")
                }
                if (r == 'lower' && this[pro]) {
                    this[pro] = this[pro].toString().toLowerCase();
                }
                if (r == 'upper' && this[pro]) {
                    this[pro] = this[pro].toString().toUpperCase(); aa
                }
                if (r == 'namespace' && this[pro] && !utilities.validateNameSpaceName(this[pro])) {
                    this.setError(pro, "Property " + pro + " is invalid. A namespace just contains a-z,A_Z,0-9,_")
                }
            }
        }
        console.log(this.error)
        if (utilities.objectIsEmpty(this.error)) {
            return true;
        }
        return false;
    }

    /**
     * get mongo collection
     */
    get collection() {
        if (this.collectionName == '' || this.databaseName == '') {
            throw new Error("You need to set collectionName or databaseName")
        }
        if (!this.__collection) {
            this.__collection = this.mongoDriver.collection(this.databaseName, this.collectionName)
        }
        return this.__collection;
    }

    /**
     * get class mongo driver
     */
    get mongoDriver() {
        return new mongoDb(this.mongoDbHost);
    }

    /**
     * binding data for model when you find a siteConfig
     * @param {*} data 
     */
    async bindingModel(data, model) {
        model.data = {};
        var d = await data;
        if (d && typeof (d) == 'object') {
            model.data = d;
        }
        return model;
    }
}

module.exports = baseModel