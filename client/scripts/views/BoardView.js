define([
    'backbone',
    'underscore',
    'views/pointTable',
    'views/tagSidebar',
    'views/toolbarView',
    'models/board',
   
    
], function(Backbone, _,pointTable,tagSidebar,Toolbar,Model) {
    return Backbone.View.extend({

        el: $('body'),
        pointTable: null,
        pointAddform: null,
        pfilter: null,

        //Reference to Socket controller
        socketController: pointClient.socketIO,

        initialize: function(){
            this.views_init();
            this.pfilter = $('#pfilter');
            $('#username').focus();
        },
        
        events : {
            'keyup #pfilter': 'fuzzypoints'
        },

        fuzzypoints : function(event){

            val = this.pfilter.val();
            this.pointTable.filterBy('s_label',val); 
        },


        on_keypress : function(ev){
            

        },
    
        initPointAdd : function(){
            
            require(['views/pointAdd','libs/picker',],function(View){
                this.renderObj =  new View({model: pointClient.tags , table: pointClient.pointTable});
            });
        },

        changeMode : function(mode){
            pointClient.mode= mode;
        },

        views_init: function(){

            
            this.pointTable = pointClient.pointTable = new pointTable({parent:this});
            pointClient.tagSidebar = this.tagSidebar = new tagSidebar();
            this.toolbar = new Toolbar({parent: this});
            //this.pointAddform =  new 
            //App.addPointForm = new pointClient.Views.addPointForm({model: this.collection});
        }


    });
});