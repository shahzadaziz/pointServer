//static Class to generate SVG content
// SVG related logic

define(['models/point'],function(point) {
    return  function(svg,domsvg,points){


    function getGridLocation(index,s_data){

        index= index +1; //Start logic with 1
        var tableWidth = 800;
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

      if(containers.select('.tile_label')[0][0]  != null){
        containers.select('.tile_label').text(function(d,i) {return d.s_label;});
        return;
      }

      containers.append("text")
          .attr('class','tile_label')
          .attr('pointer-events','none')
          .attr('x' ,function(d,i) {return d.x + 10;})
          .attr("y", function(d,i) {return d.y + 40;}).text(function(d,i) {return d.s_label;})
          .attr('fill',this.baseText)
          .attr('style',this.baseTextStyle)
          .attr('text-antialiasing','true');
    }

    function _shapeCreateHoverControls(containers){
      containers.append('text')

        .attr('x',function(d,i){return (parseInt(d.x) + parseInt(d.s_dim)) -22;})
        .attr('y',function(d,i){return (parseInt(d.y) + parseInt(d.s_dim)) -10;})
        .attr('fill','#fff')
        .text(function(d,i){ return d.s_c | 0;});

      /*containers = containers.append('g').attr('class','hover').attr('opacity', '0');

      containers.append('g')
      .append("rect").attr("width" , "18").attr("height","18").attr("x", function(d,i) {return d.x + 30;}).attr("y", function(d,i) {return d.y + 95;}).attr("fill",'#C2C7BE').attr('pointer-events','none')
      .append("text").text("x").attr('text-antialiasing','true').attr('style','font-family: ; font-size: 14px;').attr("x", function(d,i) {return d.x + 34;}).attr("y", function(d,i) {return d.y + 107;}).attr("fill",this.baseText).attr('pointer-events','none');

      containers.append('g')
      .append("text").text("open >").attr('text-antialiasing','true').attr('style','font-family: ; font-size: 12px;').attr("x", function(d,i) {return d.x + 74;}).attr("y", function(d,i) {return d.y + 107;}).attr("fill","#000").attr('pointer-events','none');*/
    }

    function _shapeCreateRect(containers){

      if(containers.select('.tile_shape')[0][0]  != null){
        containers.select('.tile_shape').attr("fill", function(s_data,i){
          var pt = getGridLocation(i,s_data);
          s_data.x = pt.x;
          s_data.y = pt.y;
          return s_data.s_color;
        });
        return;
      }else{
        var rects = containers.append('rect')
              .attr('class','tile_shape')
              .attr("width", function(s_data,i){ return s_data.s_dim;})
              .attr("height", '0')
              .attr("fill", function(s_data,i){ return s_data.s_color;})
              .attr("x", function(s_data,i){ x = getGridLocation(i,s_data).x; s_data.x = x; return x;})
              .attr("y", function(s_data,i){ y = getGridLocation(i,s_data).y; s_data.y = y; return y;});

        return rects;
      }
    }


     function _shapeDescriptionContainer(containers){
      if(containers.select('.sdesc')[0][0]  != null){
        //containers.select('.sdesc').remove();
        //return;
        containers.select('p').html(function(d,i){ return '<div class="s_desc">' + d.s_desc.substring(0,90) + '...<div>';});
        //containers.select('.sdesc').attr("fill", function(s_data,i){ return s_data.s_color;})
        return;
      }
        var htmlContent = containers.append('foreignObject')
            .attr('class', 'sdesc')

            .attr('x', function(d,i){return d.x + 10;})
            .attr('y', function(d,i){return d.y + 50;})
            .attr('width', function(d,i){return d.s_dim -30;})
            .attr('height', function(d,i){return d.s_dim -20;})
            .attr('pointer-events','none')
            .append("xhtml:p")
            .html(function(d,i){
              return '<div class="s_desc">' +
                d.s_desc.substring(0,90) +
                '<div>';});


    }


    function _updateShape(d,i, container){

      //empty container here :: so code can be resused::
      //_emptyShapeContainer(container);

      //update g container:
      container
      .attr('link',d.s_link)
          .attr('label',d.s_label)
          .attr('jsondata', JSON.stringify(d));

      //container.select('.sdesc').remove();
      //container.select('.favic').remove();

      _shapeCreateLabels(container);
      _shapeCreateRect(container);
      _shapeFavicon(container);
      _shapeDescriptionContainer(container);
      //_shapeCreateHoverControls(container);
    }

    function _shapeFavicon(containers){

       //Favicon
      if(containers.select('.favic')[0][0]  != null){
          containers.select('.favic').attr('xlink:href',  function(d,i) {return 'https://getfavicon.appspot.com/http://'+d.s_link;})
            // 'http://www.google.com/s2/favicons?domain=' + d.s_link;})
          .attr('opacity', '1');
          return;
      }

      containers.append('image')
      .attr('class','favic')
      .attr('x', function(d,i) {return d.x + 10;}).attr('y', function(d,i) {return d.y + 120;}).attr('height',16).attr('width',16).attr('preserveAspectRatio', 'none')
      .attr('xlink:href',  function(d,i) {return 'https://getfavicon.appspot.com/http://'+d.s_link;}).attr('opacity', '1');

    }

    function _emptyShapeContainer(container){
      container.select('.sdesc').remove();
      container.select('.tile_label').remove();
      container.select('.hover').remove();
      container.select('.favic').remove();

    }

    function _selectBy(collection){

        var selection = svg.selectAll('.tiles').data(collection.toJSON()).attr('index', function(d,i){
            _updateShape(d,i,d3.select(this));
            return i;
        });

        var containers = this.enterSelection(selection);

        selection.exit()
        .remove();

        containers.transition().attr('opacity','1');
        containers.selectAll('.tile_shape').transition().attr('height', function(d,i) {return d.s_dim;});

    }


    function _enterSelection(selection){

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

      var rects = this.shapeCreateRect(containers);
      _shapeDescriptionContainer(containers);

      //labels
      this.shapeCreateLabels(containers);

      //toolbar controls
      this.shapeCreateHoverControls(containers);

      _shapeFavicon(containers);
      return containers;
    }

    function drawAll(jsonObj,bln_t){

      var selection = svg.selectAll('.tiles')
        .data(jsonObj);

      var containers = this.enterSelection(selection);
      //transitions
      if(bln_t){
        containers.transition().delay(function(d,i){return i* 50}).duration(this.DURATION_S1K).attr('opacity','1');
        containers.selectAll('.tile_shape').transition().delay(function(d,i){return i* 50}).duration(this.DURATION_1K).attr('height', function(d,i) {return d.s_dim;}).ease('bounce');
      }else{
        containers.transition().attr('opacity','1');
        containers.selectAll('.tile_shape').transition().attr('height', function(d,i) {return d.s_dim;});
      }

    }


    function removeAll(blnRender,bln_t){
      pointClient.blnRender = blnRender;

      var select = d3.selectAll('svg > g');

      if(bln_t){
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
      }else{
        select.remove();
        return (pointClient.blnRender) ?  pointClient.pointTable.render() : '';
      }

    }


    function on_click(oGWrap,s_data){
        d3.select(oGWrap).on('click',function (){


          var select = d3.select(this);


          if(pointClient.mode == MODE_R){
            pointClient.pointTable.removePoint(select.datum(),select);
          }
          else if(pointClient.mode == MODE_E){
            pointClient.pointTable.selected = select.datum();
            pointClient.mainView.initPointAdd();
          }
          else{
            s_data = select.datum();
            select.select('.tile_shape').transition()
                 .duration(this.DURATION_S1K)
                 .attr('fill', s_data.s_color).ease('fade');;

            select.select('.tile_label').transition()
                 .attr('fill','#FFF').ease('fade');

            select.select('.sdesc').transition()
                .attr('class','s_desc').ease('fade');

            //Click Count maintain
            pointClient.pointTable.clickPoint(select.datum());

          }
      })

    };


    function on_mouseover(oGWrap){
      d3.select(oGWrap).on('mouseover',function (){

          var container = d3.select(this);

          container.select('.tile_shape').transition()
               .duration(this.DURATION_S1K)
               .attr('fill','#FFF').ease('fade');;

          container.select('.tile_label').transition()
               .attr('fill',function(d,i){return d.s_color;}).ease('fade');
          container.select('.sdesc').transition()
              .attr('class','s_deschover').ease('fade');



      })
    };

    function on_mouseout(oGWrap){

      d3.select(oGWrap).on('mouseout',function (){



          var container = d3.select(this);
          s_data  = d3.select(this).datum();

          container.select('.tile_shape').transition()
               .duration(this.DURATION_S1K)
               .attr('fill', s_data.s_color).ease('fade');;

          container.select('.tile_label').transition()
               .attr('fill','#FFF').ease('fade');

          container.select('.sdesc').transition()
              .attr('class','s_desc').ease('fade');


      })
    }

    function _setSVGDims(s_dim){

      n_tiles = Math.floor(this.tablewidth/s_dim);
      n_rows = Math.ceil(pointClient.points.length/n_tiles);
      height = (n_rows * s_dim) +  (15 * n_rows);
      svg.attr('height', height);

    }

    function _setPoints(collection){
      this.points = collection;
    }

    //Theme colors
    this.baseText = '#fff';
    this.baseTextStyle = 'font-family: Lato; font-size: 18px;';
    // this.pointHover = '#ECECDB';
    this.pointHover = '#FFF';

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
    this.selectBy = _selectBy;
    this.enterSelection =_enterSelection;
    this.setSVGDims = _setSVGDims;


  };

});

