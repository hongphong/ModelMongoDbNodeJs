/*
 * @Author: Phong Pham Hong 
 * @Date: 2018-03-01 14:55:39 
 * @Last Modified by: Phong Pham Hong
 * @Last Modified time: 2018-04-19 10:41:59
 * 
 * Base Class that hepl working with MongoDB
 */

const { MongoClient } = require('mongodb');
// store connection from multi mongodb host
let _instanceMongoDbConnection = {};
// store databases 
let _activeSingleMongoDbs = {};
// store collections
let _activeSingleMongoCols = {}

class mongoDbConnection {
    /**
     * constructor 
     * @param {*} hostName 
     */
    constructor(hostName = "main", dbName = null) {
        this._hostName = hostName;
        this.loadConfig();
    }
    
    /**
     * set engine and store to static member:_instanceMongoDbConnection
     * that will keep this connection (singeleton)
     */
    create_connection() {
        const config = this.loadConfig();
        var cf = config;
        var opts = 'options' in config ? config['options'] : {};
        var uri = cf['uri']
        this._uri = uri;
        if (!(uri in _instanceMongoDbConnection)) {
            _instanceMongoDbConnection[uri] = MongoClient.connect(uri, opts);
            plog.log('Create connection to MongoDb with uri: ' + uri)
        }
        this._connection = _instanceMongoDbConnection[uri];
        return this;
    }
    /**
     * get engine
     */
    get connection() {
        if (!this._connection) {
            this.create_connection()
        }
        return this._connection
    }
    /**
     * load config from json file and save as singeleton 
     */
    loadConfig() {
        const hostName = this._hostName;
        this._configDbAll = project_settings.database["mongodb"];
        if (this._configDbAll.hasOwnProperty(hostName)) {
            this.__config = this._configDbAll[hostName];
            return this.__config;
        } else {
            throw new Error("Mongodb Hostname Config: '" + hostName + "' is invalid. Please check your hostname again.");
        }
    }

    /**
     * Returns a promise of a `db` object.
     * Store Db into global variables
     * @param {*} dbName 
     */
    async activeDb(dbName) {
        if (!dbName) {
            throw new Error("Your must set database name.")
        }

        const key = this.__config['uri'] + '/' + dbName;
        if (!(key in _activeSingleMongoDbs)) {
            const connect = await this.connection;
            plog.log('Active connection to db <' + dbName + '> with key: ' + key)
            _activeSingleMongoDbs[key] = connect.db(dbName);
        }
        return _activeSingleMongoDbs[key]
    }
    /**
     * Returns a ready-to-use `collection` object from MongoDB.
     * @param {*} db 
     * @param {*} collection 
     */
    async collection(dbName, collectionName) {
        if (!dbName || !collectionName) {
            throw new Error("Your must set database name and collection name.")
        }
        const key = this.__config['uri'] + '/' + dbName + '/' + collectionName;
        if (this._configDbAll["singeletonCollection"] && !(key in _activeSingleMongoCols)) {
            const db = await this.activeDb(dbName);
            const collection = db.collection(collectionName);
            plog.log('Active singeleon collection <' + collectionName + '> with key: ' + key)
            _activeSingleMongoCols[key] = collection;
        } else if (this._configDbAll["singeletonCollection"]) {
            return _activeSingleMongoCols[key];
        }

        // return  _activeSingleMongoCols[key];
        const db = await this.activeDb(dbName);
        const collection = db.collection(collectionName);
        plog.log('Active collection <' + collectionName + '> with key: ' + key)
        return collection;
    }
}
module.exports = mongoDbConnection;