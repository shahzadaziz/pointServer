define([
	'backbone',
	'underscore',
	'models/pointTable',
	'views/point',
	'd3',
	'loung_svg_kit/shapes'
], function(Backbone, _, _model, pointView,d3,shapes){
	return Backbone.View.extend({

		pointHash: {},
        p_count:0,

        el: $('body'),

		initialize: function() {
			this.tableInit();
			pointClient.points = this.collection =  new _model();

     		this.collection.bind('reset',this.render,this);
            this.collection.bind('add',this.addPoint,this);

			
			//this.shapes = new shapes();
		},	
 
		render: function() {
			
		},

        tableInit: function(){
     
            //D3 Intialization
           
            svg = d3.select('svg').attr("width", "100%").attr("height", "100%");
            domsvg = document.getElementsByTagName('svg').item(0);
            pointClient.shapes = this.shapes = new shapes(svg,domsvg);
            //oloungeShapes = App.oloungeShapes = new lounge_shapes(svg,domsvg);

        },
        
        fetchPoints: function(){    
        	this.collection.fetch();
        },

        addPoint: function(){
            oPoint = {};
            _.each(this.$el.serializeArray(), function(_field){
                oPoint[_field.name] =  _field.value;
            });
            //Todo 
            oPoint.id= Math.floor((Math.random()*10)+1);
            oPoint.s_dim = '120';
            oPoint.s_color = '';
            this.removeall();
            this.collection.add(oPoint);
            this.pointHash = {};
            s_count = 0;
            this.render();
            //App.points.add(oPoint);
            //App.PointsSync.save();
            //console.log(JSON.stringify(oPoint));
        },

        events: {
        	 'click .connect': 'connect',
             'click .save' : 'addPoint'
        },

        addHash: function(_point,_view){
            this.pointHash[_point.id] =  _view;
            return _view;
        },


        removeall: function(){
            this.pointHash = {};
            //this.collection.reset();
            this.shapes.removeAllTiles();
           /* _.each(this.pointHash,function(_point){
                debugger;
                _point.remove();      
            });*/
        },

        redraw: function(){

        },

        render: function(){
            
             this.collection.each(function(point){
                 pointClient.pointTable.addHash(point,(new pointView({model: point,shapes: pointClient.shapes}).render())); 
            });
        },

        connect: function(){

            var IO = pointClient.socketIO;
            var user_name = $('#username').val() || 'Guest';
            
            IO.registerUserName(user_name);
            //move to callback
            this.fetchPoints();

        }



	});
});