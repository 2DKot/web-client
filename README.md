# web-client
It is a web-client for AI-Contester server.

#Build and run
After all you need to install NodeJS from https://nodejs.org/.

Then, run in 'web' folder:
``` bash
npm install gulp -g
npm install
```
First build
``` bash
gulp build-app
```
Run
``` bash
node server
```
Rebuild
``` bash
gulp clean
gulp build-app
```
#Configuration
You can set ip and port of backend server and other options in config.json file.
Also you can do it by command-line options or environment variables.
Type ```node server --help``` to see more information.
