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
             //s_data = '{"s_dim" : 121 , "s_color" : "#CCC", "s_label" : "Google", "s_link":"google.com" }';
            x = (s_count * parseInt(this.model.attributes.s_dim)+(s_count*10))
            logger('x,count ; ' +  x + ',' + s_count,'d3');
            return this.shapes.createElement(this.model.toJSON(),x,10);
        }
    });
});