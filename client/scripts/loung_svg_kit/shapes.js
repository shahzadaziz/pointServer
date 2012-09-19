//static Class to generate SVG content
// SVG related logic

define(['models/point'],function(point) {
    return  function(svg,domsvg,points){
    
  
    function getGridLocation(index,s_data){
        
        index= index +1; //Start logic with 1
        var tableWidth = 700;
        row_count = Math.floor(tableWidth /s_data.s_dim) -1;
        row_num =   Math.ceil(index/row_count);
        row_index= index%row_count;
        row_index = (row_index == 0) ? row_count : row_index;

        x_pad = ((row_index == 1) ? 0 : ((row_index-1) * s_data.s_dim));
        y_pad = ((row_num == 1) ? 0 : ((row_num-1) * s_data.s_dim));
        dim = {};
        dim.y =  (row_num * 10) + y_pad;
        dim.x = (row_index * 10) + x_pad;
        return dim;

    }

    function _shapeCreateLabels(containers){
      
      containers.append("text")
          .attr('class','label')
          .attr('pointer-events','none')
          .attr('x' ,function(d,i) {return d.x + 10;})
          .attr("y", function(d,i) {return d.y + 40;}).text(function(d,i) {return d.s_label;})
          .attr('fill',this.baseText)
          .attr('style',this.baseTextStyle)
          .attr('text-antialiasing','true');

    }


    function _shapeCreateHoverControls(containers){
      containers = containers.append('g').attr('class','hover').attr('opacity', '0');

      containers.append('g')
      .append("rect").attr("width" , "18").attr("height","18").attr("x", function(d,i) {return d.x + 30;}).attr("y", function(d,i) {return d.y + 95;}).attr("fill",'#C2C7BE').attr('pointer-events','none')
      .append("text").text("x").attr('text-antialiasing','true').attr('style','font-family: Dotum; font-size: 14px;').attr("x", function(d,i) {return d.x + 34;}).attr("y", function(d,i) {return d.y + 107;}).attr("fill",this.baseText).attr('pointer-events','none');

      containers.append('g')
      .append("text").text("open >").attr('text-antialiasing','true').attr('style','font-family: Dotum; font-size: 12px;').attr("x", function(d,i) {return d.x + 74;}).attr("y", function(d,i) {return d.y + 107;}).attr("fill","#000").attr('pointer-events','none');

      //Favicon
      containers.append('image')
      .attr('x', function(d,i) {return d.x + 8;}).attr('y', function(d,i) {return d.y + 95;}).attr('height',14).attr('width',14).attr('preserveAspectRatio', 'none')
      .attr('xlink:href',  function(d,i) {return 'http://www.google.com/s2/favicons?domain=' + d.s_link;}).attr('opacity', '0');

    }

    function _shapeCreateRect(containers){
      var rects = containers.append('rect')
            .attr('class','shape')
            .attr("width", function(s_data,i){ return s_data.s_dim;})
            .attr("height", '0')
            .attr("fill", function(s_data,i){ return s_data.s_color;})
            .attr("x", function(s_data,i){ x = getGridLocation(i,s_data).x; s_data.x = x; return x;})
            .attr("y", function(s_data,i){ y = getGridLocation(i,s_data).y; s_data.y = y; return y;});

      return rects; 
    }


 

    function drawAll(jsonObj){
      
      var selection = svg.selectAll('.tiles')
        .data(jsonObj);

      var containers = selection.enter()
        .append('g')
          .attr('class','tiles')
          .attr("opacity", 0)
          .attr('index' ,function(d,i){
              //function for container specific logic
              
              //this.points.get(d);
              pointClient.sCount ++;
              on_click(this,d);
              on_mouseover(this);
              on_mouseout(this);
              return i;

           })
          .attr("g","1")
          .attr('link',function(d,i){ return d.s_link})
          .attr('label',function(d,i){ return d.s_label})
          .attr('jsondata', function(d,i){ return JSON.stringify(d);});
                    /*
      selection.exit().transition().delay(function(d,i){return i* 50})
        .duration(this.DURATION_S1K).attr('opacity','0')
        .each('end',function(){d3.select(this).remove(); 
          pointClient.shapes.renderAll(pointClient.pointTable.collection);
        });*/

      var rects = this.shapeCreateRect(containers);

      containers.append('image')
      .attr('x', function(d,i) {return d.x;}).attr('y', function(d,i) {return d.y;}).attr('height',function(d,i) { return d.s_dim})
      //.attr('width',function(d,i) { return d.s_dim})
      .attr('preserveAspectRatio', 'true')
      .attr('xlink:href',  'images/aa.jpg');
/*
      setInterval(function(containers){ 
          // Content randomizer :: 

          svg.selectAll('.tiles > image').transition().duration(1000).delay(function(d,i){return (Math.floor((Math.random()*10)+1) *i)}).attr('width',function(d,i){
            return ((Math.random()*0)+1) ? 150: 0;
          });

      }, 4000);
*/

      //labels
      this.shapeCreateLabels(containers);      

      //toolbar controls
      this.shapeCreateHoverControls(containers);

      //transitions 
      containers.transition().delay(function(d,i){return i* 50}).duration(this.DURATION_S1K).attr('opacity','1');
      rects.transition().delay(function(d,i){return i* 50}).duration(this.DURATION_1K).attr('height', function(d,i) {return d.s_dim;}).ease('bounce');        


    }


    function removeAll(blnRender){
      pointClient.blnRender = blnRender;

      var select = d3.selectAll('svg > g');
      select.transition()
        .duration(this.DURATION_S1K)
        .delay(function(d, i) { return i * 100; })
        .attr("transform", "scale(1,0.001)")
        .each('end',function(d,i){
          
          d3.select(this).remove();
          pointClient.sCount--;
         
          if(pointClient.blnRender &&(pointClient.sCount ==0)){
            pointClient.pointTable.render();
          } 
          });
      
    }


    function on_click(oGWrap,s_data){
        d3.select(oGWrap).on('click',function (){

          // oloungeShapes.removeShape(d3.select(this));
          // return;

          var select = d3.select(this);
          
          pointClient.pointTable.removePoint(select.datum(),select);
          //window.open(this.getAttribute('link'));
      })

    };


    function on_mouseover(oGWrap){
      d3.select(oGWrap).on('mouseover',function (){
          
          var container = d3.select(this);

          container.select('.shape').transition()
               .duration(this.DURATION_S1K)
               .attr('fill','#ECECDB').ease('fade');;

          container.select('.label').transition()
               .attr('fill','#000').ease('fade');

      })
    };

    function on_mouseout(oGWrap){

      d3.select(oGWrap).on('mouseout',function (){

          
          
          var container = d3.select(this);
          s_data  = d3.select(this).datum();

          container.select('.shape').transition()
               .duration(this.DURATION_S1K)
               .attr('fill', s_data.s_color).ease('fade');;

          container.select('.label').transition()
               .attr('fill','#FFF').ease('fade');

      }) 
    }

    function _setPoints(collection){
      this.points = collection;
    }

    //Theme colors
    this.baseText = '#fff';
    this.baseTextStyle = 'font-family: Verdana; font-size: 16px';
    this.pointHover = '#ECECDB';
    this.baseToolbar = '#C2C7BE';

    this.DURATION_S1K = 450;
    this.DURATION_1K = 1000;
    this.DURATION_3K = 3000;
    this.tableheight =600;
    this.tablewidth= 700; 
    this.svg = d3.svg;
    this.domsvg = domsvg;
    this.bln_transitions = true;
    this.tile_width = 120; 
    this.points = null;

    //functions exposed
   
    this.removeAllTiles = removeAll;
    this.renderAll = drawAll;
    this.shapeCreateLabels = _shapeCreateLabels
    this.shapeCreateHoverControls = _shapeCreateHoverControls;
    this.shapeCreateRect = _shapeCreateRect;
    this.setPoints = _setPoints;
    

  }; 

});

  