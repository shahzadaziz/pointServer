define([
	'backbone',
	'models/point'
], function(Backbone, point) {
	return Backbone.Collection.extend({
		model: point,

        url: function(){ return '/points?sid='+pointClient.socketIO.socket.sessionid},

        parse: function(response){
            return response.points;
        }
	})
});