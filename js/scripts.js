$(document).ready(function() {
  var h=1;
  var ars=[];
  var socket=io();
  var colorInd=0;
  var colorOf=0;
  var key="";
  var teams=['blue','red','green'];
  var colors=['2f00ff','ff4545','4de14d'];
  $(".map").hide();
  socket.on('numplayers', function (data) {
    $('#num').text(data.num);
    if(parseInt(data.start,10)==1){
      $(".lobby").hide();
      $(".map").show();
    }
  });
  socket.on('winner', function (data) {
      console.log(data.color);
        $('#myModal').css('display','block');
        if (parseInt(data.color,10)==colorInd) {
          $('.modal-text').text('You won!')
        }
        else{
          $('.modal-text').text('You Lost!')
        }
  });
  socket.on('mycolor', function (data) {
      colorInd=parseInt(data.color,10);
      $('img').mapster({
        fillColor: colors[colorInd],
        fillOpacity: 1,
        stroke: true,
        strokeColor: "000",
        strokeOpacity: 1,
        strokeWidth: 3,
        });
  });

  socket.on('redraw', function (data) {
    ars=[];
    var a;
    for (var areas in data) {
      a=parseInt(data[areas],10);
      if(a!=-1){
        ars.push({
          key: String(areas-1),
          selected: true,
          fillColor: colors[a],
          render_highlight: {
            fillColor: colors[colorInd],
          }
        })
      }
    }
    var options = {
      fill:true,
      fillColor: colors[colorInd],
      fillOpacity: 1,
      stroke: true,
      strokeColor: "000",
      strokeWidth: 3,
      areas:  ars
    };
    $('img').mapster('rebind',options);
  });


  $('area').live('click',function() {
    var a=parseInt($(this).attr('data-key'),10)-1;
      var options = {
        fill:true,
        fillColor: colors[colorInd],
        fillOpacity: 1,
        stroke: true,
        strokeColor: "000",
        strokeWidth: 3,
        areas:  ars
      };
      $('img').mapster('rebind',options);
        socket.emit('click',{change:$(this).attr('data-key'),color:colorInd.toString()});
  });

  $('.join').live('click',function() {
     socket.emit('userjoin',{});
     $('.join').hide();
   });



});
