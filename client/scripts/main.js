
/*******************************/
/*  Point Lounge Client        */
/*  Author : Shahzad Aziz      */
/*  Backbone for SocialPoints  */
/*******************************/

    require.config({
    'paths': {
        'jquery': 'libs/jquery',
        'bootstrap': 'bootstrap/js/bootstrap',
        'backbone': 'libs/backbone',
        'underscore': 'libs/underscore',
        'd3': 'libs/d3'
    },
 
    shim: {
        'backbone': {
            // These script dependencies should be loaded 
            // before loading backbone.js
            deps: ['underscore', 'jquery'],
            // Once loaded, use the global 'Backbone' 
            // as the module value.
            exports: 'Backbone'
        },
        'underscore': {
            // Use the global '_' as the module value.
            exports: '_'
        },
        'd3': {
            exports: 'd3'
        }

    }
    });

require([
    'views/boardView',
    'views/socketController'

], function(mainView,socketIO) {
    
    pointClient.console =$('#client-console');      
                
    App = pointClient;
    logger('Intitalizing','SocketIO');
    logger('Script Load callback','RequireJS');

    /*Point client Router*/
    pointClient.Router = Backbone.Router.extend({
        routes : {
            "": "defaultRoute",
            "home": "lounge" 
        },

        register: function(){
        
            
        },

        defaultRoute: function(){

            logger('Welcome to points Lounge','Router');
            logger('Beta version  Created by Shahzad Aziz','Router');
            logger('Start consuming','Router');
            pointClient.socketController = socketIO;

            pointClient.mainView = new mainView(); 
            pointClient.socketController.connect();
            
        }

    });

    App.Router = new pointClient.Router();
    Backbone.history.start();



  });