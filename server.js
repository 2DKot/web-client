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
    serveStatic = require('serve-static'),
    fs = require('fs');
    
require('source-map-support').install();
var app = connect();
app.use(serveStatic(__dirname + '/dist/app'));
app.use('/lib/react', serveStatic(__dirname + '/node_modules/react/dist/'));
app.use('/lib/react', serveStatic(__dirname + '/node_modules/react-dom/dist/'));
app.use('/lib/fetch', serveStatic(__dirname + '/node_modules/whatwg-fetch/'));
var config = makeConfig();
app.use('/config', function(req, res) {
    res.end('var config = ' + JSON.stringify(config) + ';');
});
app.listen(config.port, function () {
    console.log('Front-end server is ready! And listen on ' + config.port + '.');
});

function makeConfig() {
    var file = JSON.parse(fs.readFileSync('config.json', 'utf8'));
    var conf = {};
    conf.backend = {};
    conf.backend.ip = argv["backend-ip"] || 
                      process.env.WEB_BACKEND_IP ||
                      file.backend && file.backend.ip ||
                      '127.0.0.1';
    conf.backend.port = argv["backend-port"] ||
                        process.env.WEB_BACKEND_PORT ||
                        file.backend && file.backend.port ||
                        '3000';
    conf.port = argv["port"] ||
                process.env.WEB_PORT ||
                file.port ||
                '8080';
    return conf;
}
