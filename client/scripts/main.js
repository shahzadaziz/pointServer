
/*******************************/
/*  Point Lounge Client        */
/*  Author : Shahzad Aziz      */
/*  Backbone for SocialPoints  */
/*******************************/

    require.config({
    'paths': {
        'bootstrap': 'bootstrap/js/bootstrap.min.js',
        'jquery': 'libs/jquery',
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
    'views/mainView',
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
            "home": "defaultRoute" 
        },
        defaultRoute: function(){

            logger('Social points home','Router');
            pointClient.socketIO = socketIO;
            pointClient.Views.mainView = new mainView(); 
            pointClient.socketIO.connect();
            
        }

    });

    App.Router = new pointClient.Router();
    Backbone.history.start();



  });