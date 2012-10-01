//Board Models

define([
    'backbone',
    
], function(Backbone) {
    return Backbone.Model.extend({
    	url: function(){ return '/board'}
    })
});