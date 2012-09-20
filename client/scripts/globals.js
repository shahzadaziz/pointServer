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
        syncType: 'sync'
    }  

    function logger(log,caller){
        if(DEBUG)App.console.append('</br><span>:  ' +  caller + '></span>  '+ log);
    }

