$(document).ready(function() {
  var h=1;
  var ars=[];
  var colorInd=0;
  var colorOf=0;
  var key="";
  var room="";
  var socket;
  var colors=['455CFF','ff4545','45FF67','FCFF45','45FFFC','8B45FF','FFB645','FF45F1'];
$(".map").hide();
if(socket!=null&&socket!=undefined){
  socket.on('numplayers', function (data) {
    var a=parseInt(data.start,10);
    $('#num').text(data.num);
    if(a==0){
      $(".map").hide();
      $(".lobby").show();
    }
    else if(a==1){
      $(".lobby").hide();
      $(".map").show();
      $('.join').hide();
    }
    else if(a==2){
      $(".lobby").show();
      $(".map").hide();
      $('.join').hide();
      $('#myModal').css('display','none');
    }
    else if(a==3){
      $(".lobby").show();
      $(".map").hide();
      $('.join').show();
      $('#myModal').css('display','none');
    }
  });
  socket.on('winner', function (data) {
      ars=[];
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

}
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

  $('[id^="join"]').live('click',function() {
     var ab=($(this).attr("id"));
     room=ab[ab.length-1].toString();
     socket=io(room);
     socket.emit('userjoin',{room:room});
     $(this).hide();
   });
  $('.backtolobby').live('click',function() {
      socket.emit('reset',{});
    });
  $('.createroom').live('click',function() {
      $('#CreateModal').css('display','block');
  });
  $('.close').live('click',function() {
        $('#CreateModal').css('display','none');
  });
  $('.buttoncr').live('click',function() {
    $.ajax( {
          url: "/createroom",
          type: "post",
          dataType: "json",
          data: JSON.stringify({
            players: $('#numpl').val(),
            roomname: $('#roomn').val()
          }),
          contentType: "application/json",
          complete: function(data) {
                  console.log('success');
                  console.log(data);
                  window.location.href=window.location.href
              }
  });
  $('#CreateModal').css('display','none');
  $('#roomn').val("");
  $('#numpl').val("");
  });



});
