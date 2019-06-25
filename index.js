var express = require('express')
var app = express()
const child_process = require('child_process');


app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

let i = 0;
app.get('/', function(request, response) {
  console.log('Request number', ++i, 'received');
  response.send('Hello World!')
})

app.get('/execute', async function(request, response) {
  console.log('query in request is', request.query);

  const command = request.query.command;
  console.log('command is ', command);

  // child_process.execFile('kubectl', ['exec', 'test--dev-766fd9cbd8-9b6t6', '-n=git', '--', 'ls -la .'], function(error, stdout, stderr){
  child_process.exec('kubectl exec test--dev-766fd9cbd8-9b6t6 -n=git -- ' + command, function(error, stdout, stderr){
    if (error) {
      console.log('error in execfile', error);
    }
    console.log('stderr........', stderr);
    console.log('stdout........', stdout);
  });

  response.send('Hello World!')
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
