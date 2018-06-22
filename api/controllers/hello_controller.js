/*
 * @Author: Phong Pham Hong 
 * @Date: 2018-03-07 09:36:11 
 * @Last Modified by: Phong Pham Hong
 * @Last Modified time: 2018-06-22 13:18:21
 * 
 * load scripts by controller
 */
"use strict";
const testModel = requireModel('test').testModel;
/**
 * Handle tracking request and save into database request info (header and http query)
 * @param {*} req 
 * @param {*} res 
 */
exports.hello_action = async function (req, res) {
    // return response immediately for client
    var model = new testModel();
    model.name = 'phong'
    model.age = 'asdfa'

    // validate 
    model.validateProperties()

    // get data from collection on MongoDb
    var collection = await model.collection;
    var rs = collection.find({})

    res.send("hello world");

}
