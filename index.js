var express = require('express')
var app = express()

const Request = require('kubernetes-client/backends/request')
const backend = new Request(Request.config.fromKubeconfig('~/.kube/config'))
const client = new Client({ backend, version: '1.13' })

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

let i = 0;
app.get('/', function(request, response) {
  console.log('Request number', ++i, 'received');
  response.send('Hello World!')
})

app.get('/kubecommand', function(request, response) {
  const namespaces = await client.api.v1.namespaces.get();
  console.log('request is', request);
  console.log('~~~~~~~~~~~~~~~~~~~~~~~');
  console.log('namespaces found are', namespaces);
  const deployments = await client.api.v1.namespaces('git').get();
  console.log('deployments in git namespace are', deployments);

  response.send('Hello World!')
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
