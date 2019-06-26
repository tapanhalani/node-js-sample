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

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
