$(document).ready(function() {
  var h=1;
  var a=[];
  var socket=io();
  var colorInd=0;
  var colorOf=0;
  var key="";
  var colors=['2f00ff','ff4545','4de14d'];
  $(".map").hide();
  socket.on('numplayers', function (data) {
    console.log(data);
    $('#num').text(data.num);
    if(parseInt(data.start,10)==1){
      $(".lobby").hide();
      $(".map").show();
    }
  });
  socket.on('mycolor', function (data) {
      colorInd=parseInt(data.color,10);
      console.log(colorInd);
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
      console.log(data);
      key=parseInt(data.change,10)-1;
      console.log(key);
      colorOf=parseInt(data.color,10);
      var options = {
        fill:true,
        fillColor: colors[colorInd],
        fillOpacity: 1,
        stroke: true,
        strokeColor: "000",
        strokeWidth: 3,
        render_highlight: {
           fillColor: colors[colorInd],
           fillOpacity: 1
       },
        areas:  [{
              key: key.toString(),
              selected: true,
              fill:true,
              fillColor: colors[colorOf],
              fillOpacity:1,
              stroke: true,
              strokeColor: "000",
              strokeWidth: 3
           }]
      };
      $('img').mapster('rebind',options,true);
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
        areas:  [{
              key: a.toString(),
              selected: true,
              fill:true,
              fillColor: colors[colorInd],
              fillOpacity:1,
              stroke: true,
              strokeColor: "000",
              strokeWidth: 3
           }]
      };
      $('img').mapster('rebind',options,true);
      console.log("I sent it "+$(this).attr('data-key')+" "+colorInd.toString());
      socket.emit('click',{change:$(this).attr('data-key'),color:colorInd.toString()});
  });

  $('.join').live('click',function() {
     socket.emit('userjoin',{});
     $('.join').hide();
   });



});
/*   if(h%2==0){

else{
  $('img').mapster({
    fillOpacity:1,
    fillColor: "ff0000",
    stroke: true,
    strokeColor: "000",
    strokeOpacity: 0.8,
    strokeWidth: 4
  });
}*/
/*  $('img').mousedown(function(e) {
   $(this).mapster({
     fillOpacity: 0.4,
     fillColor: "d42e16",
   });
});*/
