//static Class to generate SVG content
// SVG related logic

define(function() {
    return  function(svg,domsvg){
    
    function removeShape(oGWrap){
      //select = d3.select(oGWrap);

      oGWrap.transition().duration(1000).attr('opacity', '0').ease('fade');
      //select.remove();

      select = d3.selectAll('svg > g > rect');
      console.log(select);
      select.transition().duration(3000).attr('x', function(d,i){
        tile_no =  (i+1)%5;
        
        a =  ((tile_no) * 120) + ((tile_no+1) * 10);
        console.log(a);
        return a;

      }).attr('y','10');


        /*tile_no =  (i+1)%5;
        if(i < 5){ //next row
          return 10;
        }else{
          rowno = ((String)(i+1));
          rowno = rowno.slice(0, 1);
          rowno = parseInt(rowno);
          
          
          
          return ((rowno -1)* this.tile_width) + (rowno * 10);
        }
      })*/
    };

    


    function getShapeElement(oElement){

      while (oElement.nodeName != 'svg'){
        if(oElement.getAttribute('g') ==1){
          return oElement;
        }
        oElement = oElement.parentElement;
      }
      return null;
    };

    function addShape(jsonData){
      var s_data = '{"s_dim" : 121 , "s_color" : "#0098DA", "s_label" : "Facebook", "s_link":"www.facebook.com", "Tags":["top","social"]}';
      var oGlist = this.domsvg.getElementsByTagName('g');
      oLastElm = oGlist.item(oGlist.length -1);
      oLastElm = getShapeElement(oLastElm);
      
      
      oBox = getbbox(oLastElm);
      t_count = s_count + 1;

      tile_no =  s_count%5;
      if(tile_no == 0){ //next row
        
        y = oBox.y + this.tile_width + 10;
      }else{
        
        y = oBox.y;
        
      }
      x = ((tile_no) * this.tile_width) + ((tile_no+1) * 10);
      console.log(tile_no);
      console.log(oBox);
      console.log(x);
      console.log(y);

      this.element(s_data,x,y);

    };

    function getbbox(oShape, blnRect){
      var oBox = {};
      
      oShape = d3.select(oShape).select('rect');

      oBox.height = parseInt(oShape.attr('height'));
      oBox.width = parseInt(oShape.attr('width'));
      oBox.x = parseInt(oShape.attr('x'));
      oBox.y = parseInt(oShape.attr('y'));
      oBox.by = parseInt(oBox.y) + parseInt(oBox.height);
      oBox.rx = parseInt(oBox.x) + parseInt(oBox.width);

      return oBox;

    };

    function transitionEnd(){
        d3.select(this).remove();
    }

    function addAll(){
      
    }

    function removeAll(){
      
      var select = d3.selectAll('svg > g');
      select.transition()
        .duration(this.DURATION_S1K)
        .delay(function(d, i) { return i * 100; })
        .attr("transform", "scale(1,0.001)")
        .each('end',transitionEnd);
      
    }
    function createElement(s_jsondata,x,y){

      s_data = s_jsondata//$.parseJSON(s_jsondata);
      
      var oGWrap = svg.append("g")
      .attr("opacity", 0)
      .attr("g","1")
      .attr('link',s_data.s_link)
      .attr('label',s_data.s_label)
      .attr('jsondata', JSON.stringify(s_jsondata));
      
      var oElm =  oGWrap.append("rect")
        .attr("x", x).attr("y",y)
        .attr("width", s_data.s_dim).attr("height", 0).attr("fill", s_data.s_color);

      var oText = oGWrap.append("text")
          .attr('pointer-events','none')
          .attr('x' ,x + 10)
          .attr("y", y + 40).text(s_data.s_label)
          .attr('fill',this.baseText)
          .attr('style',this.baseTextStyle)
          .attr('text-antialiasing','true');

      
      //Toolbar controls
      var oGToolbar = oGWrap.append("g").attr("display","none");

      var oGDelete = oGToolbar.append("g")
      oGDelete.append("rect").attr("width" , "18").attr("height","18").attr("x", x+30).attr("y", y+95).attr("fill",'#C2C7BE').attr('pointer-events','none');
      oGDelete.append("text").text("x").attr('text-antialiasing','true').attr('style','font-family: Dotum; font-size: 14px;').attr("x", x+34).attr("y", y+107).attr("fill",this.baseText).attr('pointer-events','none');

      var oGEdit = oGToolbar.append("g")
      oGEdit.append("rect").attr("width" , "18").attr("height","18").attr("x", x+50).attr("y", y+95).attr("fill",'#C2C7BE').attr('pointer-events','none');
      oGEdit.append("text").text("e").attr('text-antialiasing','true').attr('style','font-family: Dotum; font-size: 14px;').attr("x", x+54).attr("y", y+107).attr("fill",this.baseText).attr('pointer-events','none');

      var oGInfo = oGToolbar.append("g")
      oGInfo.append("text").text("open >").attr('text-antialiasing','true').attr('style','font-family: Dotum; font-size: 12px;').attr("x", x+74).attr("y", y+107).attr("fill","#000").attr('pointer-events','none').attr('pointer-events','none');

      //Favicon

      oFavicon = oGWrap.append('image')
      .attr('x', x + 8).attr('y', y + 95).attr('height',14).attr('width',14).attr('preserveAspectRatio', 'none')
      .attr('xlink:href',  'http://www.google.com/s2/favicons?domain=' + s_data.s_link).attr('opacity', '0');

      //Transitions
      oElm.transition()
        .duration(1000)
        .attr("height", s_data.s_dim).ease('bounce')
        .attr("opacity","1");

      oGWrap.transition().duration(this.DURATION_1K).attr("opacity", "1").ease('fade');
      oFavicon.transition().duration(this.DURATION_3K).attr("opacity", "1").ease('fade');

      // Register Handlers 
      on_click(oGWrap,s_data);
      on_mouseover(oGWrap);
      on_mouseout(oGWrap);
      s_count++;
      return oGWrap;
    };

    function on_click(oGWrap,s_data){
        oGWrap.on('click',function (){

          // oloungeShapes.removeShape(d3.select(this));
          // return;
          window.open(this.getAttribute('link'));
      })

    };


    function on_mouseover(oGWrap){
      oGWrap.on('mouseover',function (){

          console.log('mouse over');
          var oRect = this.getElementsByTagName('rect').item(0);

          var select = d3.select(oRect)
          select.transition()
              .duration(this.DURATION_S1K)
              .attr('fill','#ECECDB').ease('fade');;

          var oText = this.getElementsByTagName('text').item(0);

          select = d3.select(oText);


          select.transition()
              .attr('fill','#000').ease('fade');;
          d3.select(this.getElementsByTagName("g").item(0)).transition().duration(this.DURATION_S1K).attr("display", "visible").ease('fade');;

      })
    };

    function on_mouseout(oGWrap){

      oGWrap.on('mouseout',function (){

          s_data = $.parseJSON(this.getAttribute('jsondata'));

          var oRect = this.getElementsByTagName('rect').item(0);
          var select = d3.select(oRect)
          select.transition()
              .duration(this.DURATION_S1K)
              .attr('fill',s_data.s_color).ease('fade');;
          var oText = this.getElementsByTagName('text').item(0);
          select = d3.select(oText);
          select.transition()
              .attr('fill','#FFF').ease('fade');
          d3.select(this.getElementsByTagName("g").item(0)).transition().duration(this.DURATION_S1K).attr("display", "none").ease('fade');;
      }) 
    }


    //Theme colors
    this.baseText = '#fff';
    this.baseTextStyle = 'font-family: Verdana; font-size: 20px';
    this.pointHover = '#ECECDB';
    this.baseToolbar = '#C2C7BE';

    this.DURATION_S1K = 450;
    this.DURATION_1K = 1000;
    this.DURATION_3K = 3000;
    this.svg = d3.svg;
    this.domsvg = domsvg;
    this.bln_transitions = true;
    this.tile_width = 120; 
    this.createElement = createElement;
    this.removeAllTiles = removeAll;
  }; 

});

  