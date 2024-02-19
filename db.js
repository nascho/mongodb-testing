const { MongoClient } = require('mongodb');

let dbConnection;
const uri = 'mongodb+srv://<username>:<password>@cluster0.fwlyz9r.mongodb.net/?retryWrites=true&w=majority'

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
