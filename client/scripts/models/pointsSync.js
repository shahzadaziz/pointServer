    /*Point client Models*/
    
 define([
 	'backbone',
	'underscore'],
	function(Backbone,_){

    return Backbone.Model.extend({

    	initialize: function(options){
    		this.model = options.model;
    	},

        url: function(){ return '/points?sid='+pointClient.socketIO.socket.sessionid + '&type=' +  pointClient.syncType},

        toJSON: function(){
            var writeObj = {};
            writeObj.autoid = pointClient.autoid;
            writeObj.points = pointClient.points.toJSON();
            return writeObj;
        },
        
    });

});
    


