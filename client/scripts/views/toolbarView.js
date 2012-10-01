//Toolbar view and controller information

define([
    'backbone',
    'underscore'
    
], function(Backbone, _) {
    return Backbone.View.extend({
        el: $('.point_toolbar'),
        renderObj : null,
        parent : null,
        events: {
        	'click .btn': 'buttonAction'
            
        },

        initialize : function(options){
            this.parent = options.parent;
            
        },


        buttonAction: function(ev){
    	    target = $(ev.currentTarget);
            
            if(target.attr('id') == 'connect')return;
            action = target.attr('action');
            //debugger;
            switch(action){
                case 'add':
                    this.parent.initPointAdd();

                break;

                case 'rem':
                    this.parent.changeMode(MODE_R);
                break;

                case 'ed':
                    this.parent.changeMode(MODE_E);
                break;

                case 'sort':
                    pointClient.pointTable.filterBy('f');
                break;

                   
            }

        }

    });
});