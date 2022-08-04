/*
*
*   API main file
*
*/

// Depedendencies
const http = require('http');
const https = require('https');
const url = require('url');
const stringDecoder = require('string_decoder').StringDecoder;
const config = require('./config/');
const fs = require('fs');
const handlers = require('./lib/handlers');
const helpers = require('./lib/helpers');
const router = require('./config/router');
//

// HTTP Server
const httpServer = http.createServer((req, res) =>{
  unifiedServer(req, res);
});

// Start the server
httpServer.listen(config.httpPort, () =>{
  console.log(`Http Server listening on port: ${config.httpPort}`)
});

// HTTPS Server
const httpsConfig = {
  'key' : fs.readFileSync('./ssl/key.pem'),
  'file' : fs.readFileSync('./ssl/cert.pem'),
}

const httpsServer = https.createServer(httpsConfig, (req, res) => {
  unifiedServer(req, res);
});

// Start the server
httpsServer.listen(config.httpsPort, () =>{
  console.log(`Https Server listening on port: ${config.httpsPort}`)
});


const unifiedServer = (req, res) => {
  // Parse url
  const parsedUrl = url.parse(req.url, true);

  // Ge path
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');
  // Get query
  const queryStringObject = parsedUrl.query;
  // Http Method
  const method = req.method.toLowerCase();
  // Get Headers
  const headers = req.headers;
  //Get Payload
  const decoder = new stringDecoder('utf-8');
  let buffer = '';
  req.on('data', (data) => {
    buffer += decoder.write(data);
  });
  req.on('end', () =>{
    buffer += decoder.end();

      // Check the router for a matching path for a handler. If one is not found, use the notFound handler instead.
      let chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

      // Construct the data object to send to the handler
      let data = {
        'path' : trimmedPath,
        'query' : queryStringObject,
        'method' : method,
        'headers' : headers,
        'payload' : helpers.parseJsonToObject(buffer)
      };

      // Route request
      chosenHandler(data, (statusCode, payload) => {
        // Use the status code returned from the handler, or set the default status code to 200
        statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

        // Use the payload returned from the handler, or set the default payload to an empty object
        payload = typeof(payload) == 'object'? payload : {};

        // Convert the payload to a string
        const payloadString = JSON.stringify(payload);

        // Return the response
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(statusCode);
        res.end(payloadString);

        console.log(`Returning response: ${statusCode} ${payloadString}`);
      });
  });
}

