// Add point View

define([
    'backbone',
    'underscore',      
    'bootstrap',
    'text!templates/addPointTPL.html',
    
], function(Backbone, _,bootstrap,Template) {
    return Backbone.View.extend({

        el: $('#modal'),

        initialize: function(options) {
           
            this.table = options.table; 
            this.render();
            
        },

        emptypoint : function(){
            return {"s_color":"#FFFFFF","s_label":"","s_link":"","s_desc":""};
            // return {"s_label":"",s_color:"#ffffff",s_desc:"",s_link=""};
        },
 
        render: function() {
        
           oPoint = (_.isNull(this.table.selected)) ? this.emptypoint() : this.table.selected;
           this.$el.html(_.template(Template,{tags: this.model.toJSON() , mode : pointClient.mode, point: oPoint}));
           //jQuery.noConflict();

          $('.tcolor').colorpicker();
          this.$el.modal('show');
          this.delegateEvents({'click .add': 'newPoint', 'click .drop': 'dropView'}); 
           
           
        },

        dropView : function(){
          this.$el.modal('hide');
          this.destroy_view();

        },

        newPoint: function(){
            

            oPoint = {};
            _.each($('.addform').serializeArray(), function(_field){
                oPoint[_field.name] =  _field.value;
            });
            
            oPoint.s_dim = '150';
            this.$el.modal('hide');
            
            if(pointClient.mode == MODE_E){
                this.table.updatePoint(oPoint);
            }else{
                this.table.addPoint(oPoint);  
                
            }
            
            this.destroy_view();
            delete oPoint;
         
        },


        destroy_view: function() {

            //COMPLETELY UNBIND THE VIEW
            this.table.renderObj =null;
            this.table = null;
            this.undelegateEvents();
            this.$el.html('');
            $(this.el).removeData().unbind(); 

            //Remove view from DOM
            //this.remove();  
            Backbone.View.prototype.remove.call(this);

        }
    });
});