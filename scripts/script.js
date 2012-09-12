
/*******************************/
/*  Point Lounge Client        */
/*  Author : Shahzad Aziz      */
/*  Backbone for SocialPoints  */
/*******************************/

    //Todo move it to Backbone base :: Namespace definitions
    var pointClient= {
        Models: {},
        Collections: {},
        Views: {},
        Templates:{}
    }


    pointClient.Models.syncSocket =  Backbone.Model.extend({
        toJSON: function(){
            return this.model.toJSON();
        },
        sync: function({
            
        });
    });
    
    pointClient.Models.point = Backbone.Model.extend({
      // Automatic fill from points collection
    });

    pointClient.Collections.points =  Backbone.Collection.extend({
        model: pointClient.Models.point,
        

        url: function(){
            
        }
      
    });