//Globals


    var App = null; // Global APP object initialized by Bacbone
    var oloungeShapes = null;
    var s_count = 0;
    var DEBUG = true;

    var pointClient= {
        Models: {},
        Collections: {},
        Views: {},
        Templates:{},
        socket: null,
        IOserver: 'http://localhost',
        sCount :0,
        syncType: 'sync',
        mode: 'n',
        autoid: 0

    }  

    var pfilter= {
        attr: null,
        param:null,
        buffer:0
    }


    //Statics 
    var MODE_N = 'n';
    var MODE_R = 'r';
    var MODE_E = 'e';

    function logger(log,caller){
        if(DEBUG)App.console.append('</br><span>:  ' +  caller + '></span>  '+ log);
    }

