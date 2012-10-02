define([
	'backbone',
	'models/point'
], function(Backbone, point) {
	return Backbone.Collection.extend({
		model: point,

        url: function(){ return '/points?sid='+pointClient.socketController.socket.sessionid},

        parse: function(response){
            pointClient.autoid = parseInt(response.autoid);
            return response.points;
        },

        dataSync: function(data){
        	 //Todo just push new points in broadcast .. Collection integrity:: 
            // Load to be shifted to node.
            var ids = [];

            _(data).each(function(newData){

                var _datahandle = this.get(newData);
                if(_datahandle){ _datahandle.set(newData)}
                	
                else{this.add(newData)}

                ids.push(newData.id);	
            }, this);

            var toRemove = this.reject(function(model){
            	return _(ids).include(model.id);
            });

            this.remove(toRemove);
            return this;
        }
	})
});