/*
 * Sample node.js code for AWS Lambda to upload Moltin products
 * from Moltin API to Amazon Elasticsearch.
 */

var AWS = require('aws-sdk');
var path = require('path');
const MoltinGateway = require('moltin.js').gateway;

//Your Moltin Keys
const Moltin = MoltinGateway({
  client_id: process.env.MOLTIN_CLIENT_ID,
  client_secret: process.env.MOLTIN_CLIENT_SECRET
})

//Your Elasticsearch setup
var region = process.env.ELASTICSEARCH_REGION; // e.g. us-west-1
var domain = process.env.ELASTICSEARCH_DOMAIN; // e.g. search-domain.region.es.amazonaws.com
var index = process.env.ELASTICSEARCH_INDEX;
var type = process.env.ELASTICSEARCH_TYPE;
var id = process.env.ELASTICSEARCH_ID;

/*
 * The AWS credentials are picked up from the environment.
 * They belong to the IAM role assigned to the Lambda function.
 * Since the ES requests are signed using these credentials,
 * make sure to apply a policy that allows ES domain operations
 * to the role.
 */
var creds = new AWS.EnvironmentCredentials('AWS');


/* Lambda "main": Execution begins here */
exports.handler = function(event, context) {

    Moltin.Products.All().then(products => {
        indexDocument(products);
    })
}

/*
 * Post the moltin products to Elasticsearch
 */
function indexDocument(document) {
  var endpoint = new AWS.Endpoint(domain);
  var request = new AWS.HttpRequest(endpoint, region);

  request.method = 'PUT';
  request.path += index + '/' + type + '/' + id;
  request.body = JSON.stringify(document);
  request.headers['host'] = domain;
  request.headers['Content-Type'] = 'application/json';

  var credentials = new AWS.EnvironmentCredentials('AWS');
  var signer = new AWS.Signers.V4(request, 'es');
  signer.addAuthorization(credentials, new Date());

  var client = new AWS.HttpClient();
  client.handleRequest(request, null, function(response) {
    console.log(response.statusCode + ' ' + response.statusMessage);
    var responseBody = '';
    response.on('data', function (chunk) {
      responseBody += chunk;
    });
    response.on('end', function (chunk) {
      console.log('Response body: ' + responseBody);
    });
  }, function(error) {
    console.log('Error: ' + error);
  });
}
