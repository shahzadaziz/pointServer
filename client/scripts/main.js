
/*******************************/
/*  Point Lounge Client        */
/*  Author : Shahzad Aziz      */
/*  Backbone for SocialPoints  */
/*******************************/

    var App = null; // Global APP object initialized by Bacbone
    var DEBUG = true;

    function logger(log,caller){
        if(DEBUG)App.console.append('</br><span>:  ' +  caller + '</span>:  '+ log);
    }



    require.config({
      shim: {
        underscore: {
          exports: '_'
        },
        backbone: {
          deps: ["underscore", "jquery"],
          exports: "Backbone"
        }
      }
    });
    require(['jquery', 'underscore', 'backbone'], function ($, _, Backbone) {



    //Todo move it to Backbone base :: Namespace definitions
    var pointClient= {
        Models: {},
        Collections: {},
        Views: {},
        Templates:{},
        socket: null,
        console : $('#client-console'),
        IOserver: 'http://10.10.10.133'
    }        
                
    App = pointClient;
    



    logger('Intitalizing','SocketIO');
    logger('Script Load callback','RequireJS');


    

    /*Point client Views*/
    pointClient.Views.mainView =  Backbone.View.extend({

        initialize: function(){
            App.socket = io.connect(pointClient.IOserver);

            var IO =  App.socket;

            IO.on('handshake', function (data) {
               logger(data.msg,'SocketIO');
               logger(IO.socket.sessionid,'SocketIO');

               IO.emit('handshake', { msg: 'Bacbone response -  connected', userid: IO.socket.sessionid });

               logger('handshake Complete','SocketIO');

               //fetch data 
               this.collection = App.points = new pointClient.Collections.points();
               this.collection.fetch();

             });
        }
    });


    /*Point client Models*/
    pointClient.Models.syncSocket =  Backbone.Model.extend({
        toJSON: function(){
            return this.model.toJSON();
        },
        

    });
    
    pointClient.Models.point = Backbone.Model.extend({
      // Automatic fill from points collection
    });

    pointClient.Collections.points =  Backbone.Collection.extend({
        model: pointClient.Models.point,
    
        url: function(){ return '/points?sid='+App.socket.socket.sessionid},


        parse: function(response){
            return response.points;
        }
      
    });


    /*Point client Router*/
    pointClient.Router = Backbone.Router.extend({
        routes : {
            "": "defaultRoute",
            "home": "defaultRoute" 
        },
        defaultRoute: function(){
            logger('Social points home','Router');
            App.mainView =  new pointClient.Views.mainView();
   
        }

    });

    App.Router = new pointClient.Router();
    Backbone.history.start();


    // // Backbone Sync to behave with Socket IO
    // Backbone.sync =  function(method,model,options){
    //     debugger;
        
    //     switch(method){
    //         case 'read':
    //             logger('Fething points', 'BBsync');
    //         break;

    //     }
    // };



  });