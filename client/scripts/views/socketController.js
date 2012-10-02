//Socket Controller

define(function() {
    return  {
    	connect: function(){
    		var IO = pointClient.socket = io.connect(pointClient.IOserver);
        this.socket = IO.socket;
        this.IO = IO;

            //callbacks
            IO.on('handshake', function (data) {
               logger(data.msg,'SocketIO');
               logger(IO.socket.sessionid,'SocketIO');

               IO.emit('handshake', { msg: 'Bacbone response -  connected', userid: IO.socket.sessionid });
               logger('handshake Complete','SocketIO');
             });

            IO.on('msg_resp',function(data){
                logger(data.msg,'SocketIO');
            });


            IO.on('data',function(data){
                logger(data.msg,'SocketIO');
                console.log(data.data);
                pointClient.pointTable.dataCallback(data);
            });

            IO.on('point',function(data){
              debugger;
            });
    	},

      emit : function(handle, object){
        this.IO.emit(handle, JSON.stringify(object));
      },

      registerUserName: function(_user){
          this.IO.emit('username', {username: _user},function(data){
          logger(data.msg,'SocketIO');
          

        });
      }
    };

});