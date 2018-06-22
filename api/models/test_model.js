"use strict";
/*
 * @Author: Phong Pham Hong 
 * @Date: 2018-03-02 09:57:10 
 * @Last Modified by: Phong Pham Hong
 * @Last Modified time: 2018-06-22 13:14:16
 * 
 * Build some models that use to query on mtx_system_config database (only on MongoDb)
 */
// init mongo with main config host uri
const mongoDb = requireLib('db/mongodbconnection');
const mongoMain = new mongoDb("main");
const baseModel = requireModel('base')
/** 
 * Model for test collection
*/

class testModel extends baseModel {
    constructor() {
        super();

        this.collectionName = 'collection_test';
        this.databaseName = 'database_test';

        // define properties
        this.name = ''
        this.age = ''
    }

    // define rules that validate your properties
    get rules() {
        return {
            'name': ['require'],
            'age': ['int']
        }
    }
}

module.exports = {
    testModel: testModel
}