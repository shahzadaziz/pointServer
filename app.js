// Point Node server : base APP
// Author : Shahzad Aziz
  
  PORT = 1024;

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

      var socketID = req.query['sid'] || null;
      
      console.log('Express points route ' + socketID);
      _file = fs.readFileSync(__dirname + '/data/points.json');
      _points = JSON.parse(_file);

      
      if(socketID)(_sockets[socketID].emit('msg_resp',{msg: 'Points API called ' +  socketToUsers[socketID]}));
      
      res.send(_points);
  });

  app.post('/points',function (req,res){
    console.log('Post request received from');
    console.log(req.query['sid']);
  });

  //Node IO logic
  var socketToUsers = {};
  var userToSockets = {};
	var _sockets = {};

	io.sockets.on('connection', function (socket) {

      //Socket events
      socket.on('username',function(data,callback){
        socketToUsers[socket.id] = data.username;
        userToSockets[data.username]  = socket.id;
        _sockets[socket.id]  = socket;

        console.log(data);

        socket.broadcast.emit('msg_resp',{msg: 'New User connected ' + data.username});
        callback({msg: 'Welcome ' +  data.username+ ', Fetching points..'});


      });


      socket.emit('handshake', { msg: 'Node response - Connected' });
      
      
      socket.on('handshake', function (data) {
        console.log(data);
        
      });

	});