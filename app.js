// Point Node server : base APP
// Author : Shahzad Aziz

	
	PORT = 1024;

	var colors = require('colors');
	var fs = require('fs');
	var express= require('express');
	var app = express()
	, express_server = require('http').createServer(app)
	, io = require('socket.io').listen(express_server);

				express_server.listen(PORT);

	app.configure(function () {
		//app.use(express.logger().green);
		app.use(express.cookieParser());
		app.use(express.session({secret: 'secret', key: 'express.sid'}));
		app.use(express['static'](__dirname + '/client'));
	});

	
	//Node express routes
	app.get('/', function (req, res) {
			console.log(('Express Session id is ' + req.sessionID).green);
			res.sendfile(__dirname + '/index2.html');
			//res.sendfile(__dirname + '/landing.html');
								
	});



	//Node Points REST API

	//Node express routes
	app.get('/board', function (req, res) {
			_file = fs.readFileSync(__dirname + '/data/board1.json');
			_board = JSON.parse(_file);

			res.send(_board);          
	});


	//Node Points REST API
	app.get('/tags', function (req, res) {

			var socketID = req.query['sid'] || null;
			
			console.log(('Express Tags route ' + socketID).green);
			_file = fs.readFileSync(__dirname + '/data/tags.json');
			_points = JSON.parse(_file);

			
			if(socketID)(_sockets[socketID].emit('msg_resp',{msg: 'Tags API called ' +  socketToUsers[socketID]}));
			
			res.send(_points);
	});


	app.get('/points', function (req, res) {

			var socketID = req.query['sid'] || null;
			
			console.log(('Express points route ' + socketID).green);
			_file = fs.readFileSync(__dirname + '/data/points.json');
			_points = JSON.parse(_file);

			
			if(socketID)(_sockets[socketID].emit('msg_resp',{msg: 'Points API called ' +  socketToUsers[socketID]}));
			
			res.send(_points);
	});

	app.post('/points',function (req,res){
		console.log(('Post request received from').green);
		console.log((req.query['sid']).green);

		_sid = req.query['sid'];
		_type = req.query['type'];
		_post_data = '';
		req.on('data',function(data){
			//Todo Put limit on post stream to avoid payload attack
			_post_data+= data;
		});

		req.on('end',function(){
				//JSON received:: 
				var _points = JSON.parse(_post_data);
				console.log((_points).green);
				if(_sid)(_sockets[_sid].broadcast.emit('data',{msg: 'Data added by ' +  socketToUsers[_sid], type: _type, data: _points}));

				//update file temporary
				fs.writeFile(__dirname + '/data/points.json', _post_data, function (err) {
					if (err) throw err;
					console.log('It\'s saved!'.green);
				});        

		});
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

				console.log((data).green);

				socket.broadcast.emit('msg_resp',{msg: 'New User connected ' + data.username});
				callback({msg: 'Welcome ' +  data.username+ ', Fetching points..'});


			});

			socket.on('point',function(data,callback){
				socket.broadcast.emit('point',data);
			});


			socket.emit('handshake', { msg: 'Node response - Connected' });
			
			
			socket.on('handshake', function (data) {
				console.log((data).green);
				
			});

	});