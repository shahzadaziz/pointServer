define([
	'backbone',
	'underscore',
	'models/pointTable',
    'models/PointsSync',
	'views/point',
    'views/tagSidebar',
	'd3',
	'loung_svg_kit/shapes'
], function(Backbone, _, _model, pointsSync , pointView,tagSidebar,d3,shapes){
	return Backbone.View.extend({

		pointHash: {},
        p_count:0,
        height: 600,
        width: 700,

        el: $('body'),

		initialize: function() {
			this.tableInit();
			pointClient.points = this.collection =  new _model();
            pointClient.pointsSync = this.pointsSync = new pointsSync({model: this.collection.models}); 
     		this.collection.bind('reset',this.render,this);
            
		},	
 
		render: function() {
			
		},

        tableInit: function(){
     
            //D3 Intialization
            pointClient.tagSidebar = this.tagSidebar = new tagSidebar();
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
            _.each($('.addform').serializeArray(), function(_field){
                oPoint[_field.name] =  _field.value;
            });
            //Todo 
            oPoint.id= Math.floor((Math.random()*10)+1);
            oPoint.s_dim = '150';
            oPoint.s_color = '#CCC';
            //this.removeall();
            this.collection.add(oPoint);
            
            s_count = 0;
            this.render();

            pointClient.syncType = 'sync';
            this.pointsSync.save();
        },

        removePoint: function(data,shape){
           
            this.collection.remove(this.collection.get(data));
            this.shapes.removeAllTiles(true);
            pointClient.syncType = 'remove';
            this.pointsSync.save();
           
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
            this.shapes.removeAllTiles();
           
        },


        dataCallback: function(data){
            
            var oClone = this.collection.dataSync(data.data);

            switch(data.type){
            
                case 'remove':
                    this.shapes.removeAllTiles(true);         
                break;
                
                case 'sync':
                    this.render();    
                break;
            
            };
        },

        render: function(){
            
             this.shapes.setPoints(this.collection);
             var _tiles = this.shapes.renderAll(this.collection.toJSON());

             /*this.collection.each(function(point){
                 pointClient.pointTable.addHash(point,(new pointView({model: point,shapes: pointClient.shapes}).render())); 
            });*/
        },

        connect: function(){

            var IO = pointClient.socketIO;
            var user_name = $('#username').val() || 'Guest';
            
            IO.registerUserName(user_name);
            //move to callback
            this.fetchPoints();
            this.tagSidebar.fetchTags();
        }



	});
});