/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
const defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

const messages = [];

var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  // The outgoing status.
  var statusCode = 200;

  // See the note below about CORS headers. (resolved)
  var headers = defaultCorsHeaders;

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  // headers['Content-Type'] = 'text/plain';
  headers['Content-Type'] = 'application/json';

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  // *********response.writeHead(statusCode, headers);

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  // *********response.end('Hello, world!');

  // our code
  // debugger;
  if (request.method === 'OPTIONS' && request.url === '/classes/messages') {
    response.writeHead(200, headers);
    console.log('This is an OPTIONS request');
    response.end('this is an option');
  }
  if (request.method === 'GET' && request.url === '/classes/messages') {
    response.writeHead(200, headers);
    console.log('this is the GET request------', messages);
    response.end(JSON.stringify(messages));
  } else if (request.method === 'POST' && request.url.includes('/classes/messages')) {
    let message = [];

    request.on('error', (error) => {
      console.log('This is our error---', error);
    }).on('data', (chunk) => {
      message.push(chunk);
    }).on('end', () => {
      message = JSON.parse(Buffer.concat(message).toString());
      message['message_id'] = messages.length;
      messages.push(message);
      console.log('this is the POST request------', messages);
      response.writeHead(201, headers);
      response.end(JSON.stringify(message));
    });
  } else if (request.method === 'GET' && request.url === '/supersecret') {
    response.writeHead(418);
    console.log('SECRET-----');
    response.end('THIS IS SUPER SECRET');
  } else if (request.method === 'GET' && request.url === '/forbidden') {
    response.writeHead(403);
    console.log('FORBIDDEN---');
    response.end('THIS IS SUPER SECRET');
  } else if (request.url !== '/classes/messages') {
    response.writeHead(404);
    console.log('we reached a non /classes/messages endpoint');
    response.end('No endpoint.');
  }
};

// export
exports.requestHandler = requestHandler;



