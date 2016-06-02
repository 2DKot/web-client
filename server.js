"use strict";
var connect = require('connect'), 
    serveStatic = require('serve-static');
require('source-map-support').install();
var app = connect();
app.use(serveStatic(__dirname + "/dist/app"));
app.use('/lib/react', serveStatic(__dirname + "/node_modules/react/dist/"));
app.use('/lib/react', serveStatic(__dirname + "/node_modules/react-dom/dist/"));
app.use('/lib/fetch', serveStatic(__dirname + "/node_modules/whatwg-fetch/"));
app.use('/config', serveStatic(__dirname + "/config/"));
app.listen(8080, function () {
    console.log("Front-end server is ready! And listen on 8080.");
});

//# sourceMappingURL=server.js.map
