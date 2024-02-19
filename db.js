require('dotenv').config();
const { MongoClient } = require('mongodb');


const uri = process.env.URI;


let dbConnection;

module.exports = {
    connectToDb: (cb) => {
        MongoClient.connect(uri)
            .then(client => {
                dbConnection = client.db();
                return cb();
            })
            .catch(error => {
                console.error(error);
                return cb(error);
            })
    },
    getDb: () => dbConnection
}