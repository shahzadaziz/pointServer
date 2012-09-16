define([
    'backbone',
    'underscore',
    'views/pointTable'
    
    
], function(Backbone, _,pointTable,pointForm) {
    return Backbone.View.extend({

        el: $('body'),
        pointTable: null,
        pointAddform: null,

        //Reference to Socket controller
        socketController: pointClient.socketIO,

        initialize: function(){

            this.view_init();
        },
        

        view_init: function(){

            this.pointTable = pointClient.pointTable = new pointTable();
            //this.pointAddform =  new 
            //App.addPointForm = new pointClient.Views.addPointForm({model: this.collection});
        }


    });
});