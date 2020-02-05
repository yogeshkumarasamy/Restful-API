const http = require('http');  //Import syntax in Node js
const app = require('./app');

const port = process.env.port || 3000; //This process.env.port looks for the server config in the server you gonna deploy

const server = http.createServer(app); //Passing express app to the server

server.on('listening',function(){
    console.log('Server is up and running');
});

server.listen( port );