define([
	'backbone',
	'underscore',
	'models/pointTable',
    'models/PointsSync',
	'views/point',
	'd3',
	'loung_svg_kit/shapes'
], function(Backbone, _, _model, pointsSync , pointView,d3,shapes){
	return Backbone.View.extend({

		pointHash: {},
        p_count:0,
        height: 600,
        width: 700,
        parent: null,
        selected: null,
        filterColl : null,


        el: $('body'),

		initialize: function(options) {
            this.parent = options.parent;
			this.tableInit();
			pointClient.points = this.collection =  new _model();
            pointClient.pointsSync = this.pointsSync = new pointsSync({model: this.collection.models}); 
     		this.collection.bind('reset',this.collectionFetched,this);
            //this.collection.bind('add', this.addCollection,this);
            
		},	

        collectionFetched : function(){
            this.collection.bind('add', this.addCollection,this);
            pointClient.syncType = 'remove';
            this.collection.bind('remove', this.synchronize,this);
            
            this.render();
        },
 
        tableInit: function(){
    
            svg = d3.select('svg').attr("width", "100%").attr("height", "100%");
            domsvg = document.getElementsByTagName('svg').item(0);
            pointClient.shapes = this.shapes = new shapes(svg,domsvg);
            

        },
        
        fetchPoints: function(){    
        	this.collection.fetch();
        },


        addCollection : function(){
            pointClient.syncType = 'sync';
            this.shapes.removeAllTiles(true);
            this.synchronize();
            
        },



        updatePoint : function(oPoint){
            var oldPt = this.collection.get(this.selected);
            oPoint.id = oldPt.id;
            oPoint.s_c = oldPt.s_c | 0;
            oldPt.set(oPoint);
            this.shapes.removeAllTiles(true);
            this.synchronize();  
        },


        addPoint: function(){
            oPoint.s_c = 0 , oPoint.id = pointClient.autoid++;
            this.collection.add(oPoint);
          
        },

        removePoint: function(data,shape){
            
            this.collection.remove(this.collection.get(data));
            this.shapes.removeAllTiles(true);
            pointClient.syncType = 'remove';
            pointClient.mode = MODE_N;
            this.pointsSync.save();
           
        },


        synchronize : function(){
            
            this.pointsSync.save();
        },
        
        events: {
        	 'click .connect': 'connect',
             
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

        setFilter : function(attr,param){
            pfilter.attr = attr;
            pfilter.param = param;
        },

        filterBy : function(attr,param){
            delete this.filterColl;
            this.setFilter(attr,param);

            var res =  _(this.collection.filter(function(data) {
              return (data.get(pfilter.attr).toLowerCase()).indexOf(pfilter.param.toLowerCase()) == 0;
            }));

            res = res.toArray();

            if(res.length == pfilter.buffer)
                return; 
            else
                pfilter.buffer= res.length; 

            this.filterColl = new _model();
            this.filterColl.reset(res, {silent:true});
            this.shapes.setPoints(this.filterColl);
            this.shapes.removeAllTiles(true,false);
            //this.shapes.selectBy(this.filterColl);
        },

        render: function(){
             collection = (this.filterColl == null)? this.collection : this.filterColl;
             pointClient.sCount = 0;
             this.shapes.setPoints(collection);
             var _tiles = this.shapes.renderAll(collection.toJSON());
             delete collection;
             this.shapes.setSVGDims(150);
             /*this.collection.each(function(point){
                 pointClient.pointTable.addHash(point,(new pointView({model: point,shapes: pointClient.shapes}).render())); 
            });*/
        },

        connect: function(){

            var IO = pointClient.socketController;
            var user_name = $('#username').val() || 'Guest';
            
            IO.registerUserName(user_name);
            //move to callback
            this.fetchPoints();
            pointClient.tagSidebar.fetchTags();

            $('#username').remove();
        },

        clickPoint : function(datum){
            var _model = this.collection.get(datum);
            if(!_.isUndefined(_model)){

                //Manage click Counts
                if(_.isUndefined(_model.get('s_c'))){
                    _model.set('s_c', 1);
                }else{
                    _model.set('s_c', (_model.get('s_c') + 1));
                }

                //sync Model actions across clients
                pointClient.socketController.emit('point',_model.toJSON());
            }

            window.open('http://' + datum.s_link, '_blank');
            window.focus();

        },


	});
});