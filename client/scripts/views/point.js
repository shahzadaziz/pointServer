define([
    'backbone',
    'underscore',
    'models/point',
    
], function(Backbone, _,_model,shapes) {
    return Backbone.View.extend({

        initialize: function(options) {
            this.shapes=options.shapes;
               
        },
 
        render: function() {
         
        }
    });
});