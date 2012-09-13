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
    app.use(express['static'](__dirname + '/client'));
	});

	

  //Node express routes
	app.get('/', function (req, res) {
      console.log('Express Session id is ' + req.sessionID);
      res.sendfile(__dirname + '/index.html');
          
  });

  //Node Points REST API
  app.get('/points', function (req, res) {

      var socketID = req.params.sid || null;
      console.log('Express points route ' + req.params.sid);
      _file = fs.readFileSync(__dirname + '/data/points.json');
      _points = JSON.parse(_file);
      console.log('Socket log');

      if(socketID)console.log(sockets[socketID]);
      
      res.send(_points);
  });




  //Node IO logic
  var socket_users = {};
  var sockets = {};
	
	io.sockets.on('connection', function (socket) {
      
      socket.emit('handshake', { msg: 'Node response - Connected' });
      
      //Socket events
      socket.on('handshake', function (data) {
        console.log(data);
        
        sockets[socket.id] = socket;
        socket_users[data.userid] = socket.id;

      });

      socket.on('fetch', function (data) {
        
        console.log(data);
        _file = fs.readFileSync(__dirname + '/data/points.json');
        _points = JSON.parse(_file);
        socket.emit(_points);

      });



	});