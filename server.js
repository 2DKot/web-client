'use strict';
var connect = require('connect'), 
    serveStatic = require('serve-static'),
    fs = require('fs'),
    argv = require('minimist')(process.argv.slice(2));
console.log(argv);
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
app.listen(8080, function () {
    console.log('Front-end server is ready! And listen on 8080.');
});

function makeConfig() {
    var conf = JSON.parse(fs.readFileSync('config.json', 'utf8'));
    
    //FLAGS
    if(argv.bip)    conf.backend.ip = argv.bip;
    if(argv.bp)     conf.backend.port = argv.bp;
    
    //DEFAULTS
    if(!conf.backend.ip) conf.backend.ip = '127.0.0.1'
    if(!conf.backend.port) conf.backend.port = '3000'
    return conf;
}
