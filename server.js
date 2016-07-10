'use strict';
var argv = require('minimist')(process.argv.slice(2));
if(argv.help) {
    var help = 
`AI Contester web-client
Usage:
  node server [options]
  
Options:
  --backend-ip=ip       set ip of AI_Contester web-server
  --backend-port=port   set port of AI_Contester web-server
  --port                set port for web-client

Environment variables:
  WEB_BACKEND_IP        ip of AI_Contester web-server
  WEB_BACKEND_PORT      port of AI_Contester web-server
  WEB_PORT              port for web-client`;
    console.log(help);
    return;
};

var connect = require('connect'), 
    serveStatic = require('serve-static');
    
var app = connect();
app.use(serveStatic(__dirname + '/static/'));
app.use('/lib/react', serveStatic(__dirname + '/node_modules/react/dist/'));
app.use('/lib/react', serveStatic(__dirname + '/node_modules/react-dom/dist/'));

var config = require('./config.js')(argv);

app.use('/config.js', function(req, res) {
    res.end('var config = ' + JSON.stringify(config) + ';');
});

app.listen(config.port, function () {
    console.log('Front-end server is ready! And listen on ' + config.port + '.');
});
