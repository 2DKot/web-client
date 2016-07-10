var fs = require('fs');

function makeConfig(argv) {
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

module.exports = makeConfig;
