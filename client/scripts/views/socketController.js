//Socket Controller

define(function() {
    return  {
    	connect: function(){
    		var IO = pointClient.socket = io.connect(pointClient.IOserver);
        this.socket = IO.socket;
        this.IO = IO;

            IO.on('handshake', function (data) {
               logger(data.msg,'SocketIO');
               logger(IO.socket.sessionid,'SocketIO');

               IO.emit('handshake', { msg: 'Bacbone response -  connected', userid: IO.socket.sessionid });
               logger('handshake Complete','SocketIO');
             });

            IO.on('msg_resp',function(data){
                logger(data.msg,'SocketIO');
            });
    	},

      registerUserName: function(_user){
          this.IO.emit('username', {username: _user},function(data){
          logger(data.msg,'SocketIO');
          

        });
      }
    };

});