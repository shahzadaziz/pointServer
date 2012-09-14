
/*******************************/
/*  Point Lounge Client        */
/*  Author : Shahzad Aziz      */
/*  Backbone for SocialPoints  */
/*******************************/

    var App = null; // Global APP object initialized by Bacbone
    var oloungeShapes = null;
    var s_count = 0;
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
        },
        d3:{
            deps: ['loung_svg_kit/shapes','loung_svg_kit/EventHandler'],
            exports: 'd3'
        }
      }
    });
    require(['jquery', 'underscore', 'backbone','d3'], function ($, _, Backbone,d3) {



    //Todo move it to Backbone base :: Namespace definitions
    var pointClient= {
        Models: {},
        Collections: {},
        Views: {},
        Templates:{},
        socket: null,
        console : $('#client-console'),
        IOserver: 'http://localhost'
    }        
                
    App = pointClient;
  

    logger('Intitalizing','SocketIO');
    logger('Script Load callback','RequireJS');

    /*Point client Views*/
    pointClient.Views.mainView =  Backbone.View.extend({

        initialize: function(){
            this.collection = App.points = new pointClient.Collections.points();
            App.points.bind('reset',this.render,this);
            App.socket = io.connect(pointClient.IOserver);

            var IO =  App.socket;
            this.lounge_init();

            //Todo Create a seperate IO library
            IO.on('handshake', function (data) {
               logger(data.msg,'SocketIO');
               logger(IO.socket.sessionid,'SocketIO');

               IO.emit('handshake', { msg: 'Bacbone response -  connected', userid: IO.socket.sessionid });
               logger('handshake Complete','SocketIO');

               App.points.fetch();

               
             });

            IO.on('msg_resp',function(data){
                logger(data.msg,'SocketIO');
            });

        },

        render: function(){
            _.each(this.collection.models, function(point){
                return (new pointClient.Views.point({model: point}).render());
            })
        },

        lounge_init: function(){
     
            //D3 Intialization
            svg = d3.select('svg').attr("width", "100%").attr("height", "100%");
            domsvg = document.getElementsByTagName('svg').item(0);

            oloungeShapes = App.oloungeShapes = new lounge_shapes(svg,domsvg);

        }
    });


    pointClient.Views.point = Backbone.View.extend({
        initialize: function(){

        },

        render: function(){
            //s_data = '{"s_dim" : 121 , "s_color" : "#CCC", "s_label" : "Google", "s_link":"google.com" }';
            x = (s_count * parseInt(this.model.attributes.s_dim)+(s_count+20))
            logger('x,count ; ' +  x + ',' + s_count,'d3');
            App.oloungeShapes.element(this.model.toJSON(),x,10);
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