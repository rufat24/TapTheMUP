$(document).ready(function() {
  var h=1;
  var a=[];
  var socket=io();
  var colorInd=0;
  var colorOf=0;
  var key="";
  var colors=['2f00ff','ff4545','4de14d'];
  var inds=['1','2','3','4','5','6','7','8','9','10'];
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
        strokeOpacity: 0.8,
        strokeWidth: 2,

        });
  });
  socket.on('redraw', function (data) {
      console.log(data);
      key=parseInt(data.change,10)-1;
      console.log(key);
      colorOf=parseInt(data.color,10);
      var options = {
        fillColor: colors[colorInd],
        fillOpacity: 1,
        stroke: true,
        strokeColor: "000",
        strokeOpacity: 0.8,
        strokeWidth: 2,
        areas:  [{
              key: key.toString(),
              selected: true,
              fillColor: colors[colorOf],
              fillOpacity:1,
              stroke: true,
              strokeColor: "000",
              strokeOpacity: 0.8,
              strokeWidth: 2,
              set: true
           }]
      };
      $('img').mapster('rebind',options);
  });

  $('.join').live('click',function() {
     socket.emit('userjoin',{});
     $('.join').hide();
   });

/*  $('img').mousedown(function(e) {
   $(this).mapster({
     fillOpacity: 0.4,
     fillColor: "d42e16",
   });
});*/
$('area').mouseup(function(e) {
    $(this).mapster('set',false);
    console.log("I sent it "+$(this).attr('data-key')+" "+colorInd.toString());
    socket.emit('click',{change:$(this).attr('data-key'),color:colorInd.toString()});

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


});


});
