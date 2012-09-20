// Tag Collection


define([
	'backbone',
	'models/tag'
], function(Backbone, Model) {
	return Backbone.Collection.extend({
		model: Model,

        url: function(){ return '/tags?sid='+pointClient.socketIO.socket.sessionid},

        parse: function(response){
            return response.tags;
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