define([
    'backbone',
    'underscore',
    'models/tagCollection'
    
], function(Backbone, _,Collection) {
    return Backbone.View.extend({
        el: $('.tag_list'),

        initialize: function() {
           pointClient.tags = this.collection = new Collection();
           this.collection.bind('reset',this.render,this);   
        },

        fetchTags: function(){
           this.collection.fetch(); 
        },
 
        render: function() {
            var me = this;
          
            this.collection.each(function(tag,i,me){
            
                $('<li><i class="icon-tag"></i>'+ tag.attributes.t_name+'</li>')
                .hide()
                .appendTo(pointClient.tagSidebar.$el)
                .fadeIn('slow');
                
            });

        }

    });
});