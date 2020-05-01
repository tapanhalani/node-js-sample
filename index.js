var express = require('express')
var app = express()
const child_process = require('child_process');
const MongoClient = require('mongodb').MongoClient;
var redis = require("redis")


app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

let i = 0;
app.get('/', function(request, response) {
  console.log('Request number', ++i, 'received');
  response.send('Hello Tapan, I am process number ' + process.pid);
})



app.get('/execute', async function(request, response) {
  console.log('query in request is', request.query);

  const command = request.query.command;
  const pod = request.query.pod;
  const ns = request.query.ns;
  console.log('query params is ', command, pod, ns);

  child_process.exec('kubectl exec -t ' + pod + ' -n=' + ns + ' -- /bin/bash -l -c ' + `"${command}"`, function(error, stdout, stderr){
    if (error) {
      console.log('error in execfile', error);
    }
    console.log('stdout........', stdout);
  });

  response.send('Hello World!')
})



app.get('/createMongodbCollection', async function(request, response) {
  const dbName = request.query.dbName || 'testdb';
  const collectionName = request.query.collectionName || 'customers';
  const url = 'mongodb://root:' + process.env.MONGODB_ROOT_PASSWORD +'@swell-mongodb:27017/' + dbName + '?authSource=admin';
  console.log('url is ', url);
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
    if (err) throw err;
    console.log("Database", dbName, "created!");

    var dbo = client.db(dbName);
    dbo.createCollection(collectionName, function(err, res) {
      if (err) throw err;
      console.log("Collection", collectionName, "created!");
      client.close();
      response.send('database ' + dbName + ' and collection ' + collectionName + ' created! ');
    });
  });
})



app.get('/addRedisData', async function(request, response) {
  const key = request.query.key;
  const value = request.query.value;
  client    = redis.createClient({
    port      : 6379,
    host      : 'swell-redis-master',
    password  : process.env.REDIS_PASSWORD
  });

  client.on('connect', function(){
      console.log("connected");
  });
  // setting key store values
  client.set(key, value, function(err, reply){
    if(err) throw err;
    console.log('setting value of key', key);
    console.log(reply);
  });

  client.get(key, function(err, reply){
    if(err) throw err;
    console.log('value of key', key, 'is', reply);
    response.send(' value of key ' + key + ' is ' + reply);
  });
})



app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
