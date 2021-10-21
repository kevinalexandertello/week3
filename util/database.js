const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect= (cb)=> {

    
    MongoClient.connect('mongodb+srv://kevin40597622:kevin40597622@cluster0.uzizy.mongodb.net/e-shop?retryWrites=true&w=majority')
    .then(client=>{
        console.log('connected');
        _db = client.db();
        cb()
    })
    .catch(e=>{
        console.log(e);
        throw e
        
    })
}
const getDb = ()=>{
    if (_db) return _db;
    throw _db;
}
exports.mongoConnect =mongoConnect;
exports.getDb = getDb;