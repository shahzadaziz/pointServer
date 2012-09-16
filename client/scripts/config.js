//Globals


/*    require.config({

      shim: {
       
        underscore: {
            exports: '_'
          
        },
        backbone: {
           deps: ["underscore", "jquery"],
           exports: "Backbone"
         },
        d3:{
            exports: 'd3',
        },
        
      }
    });
    require(['jquery', 'underscore', 'backbone','d3','loung_svg_kit/pointTable','loung_svg_kit/point','loung_svg_kit/shapes','loung_svg_kit/EventHandler'], function ($, _, Backbone,d3) {
*/


	// Nampespace definition 
    pointClient= {
        Models: {},
        Collections: {},
        Views: {},
        Templates:{},
        socket: null,
        console : null,
        IOserver: 'http://localhost'
    }        



    var App = null; // Global APP object initialized by Bacbone
    var oloungeShapes = null;
    var s_count = 0;
    var DEBUG = true;

    function logger(log,caller){
        if(DEBUG)App.console.append('</br><span>:  ' +  caller + '</span>:  '+ log);
    }

