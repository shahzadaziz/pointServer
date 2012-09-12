// Point Node server : base APP
// Author : Shahzad Aziz
  
  PORT = 4000;

  var fs = require('fs');
  var express= require('express');
  var app = express()
  , express_server = require('http').createServer(app)
  , io = require('socket.io').listen(express_server);

        express_server.listen(PORT);

	app.configure(function () {
		app.use(express.logger());
		app.use(express.cookieParser());
		app.use(express.session({secret: 'secret', key: 'express.sid'}));
                app.use(express['static'](__dirname + '/scripts'));
	});

	
	app.get('/', function (req, res) {
          console.log('Express Session id is ' + req.sessionID);
          res.sendfile(__dirname + '/index.html');
          
        });
	
	io.sockets.on('connection', function (socket) {
            socket.emit('news', { hello: 'world' });
            socket.on('my other event', function (data) {
              //fs.readFile(path, encoding_);
              console.log(data);
            });
	});