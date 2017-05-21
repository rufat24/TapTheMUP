$(document).ready(function() {
  var h=1;
  var a=[];
  var socket=io();
  var color="";
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
      color=data.color;
      console.log(color);
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
$('img').mapster({
  fillOpacity:1,
  fillColor: color,
  stroke: true,
  strokeColor: "000",
  strokeOpacity: 0.8,
  strokeWidth: 4
});

$('area').mouseup(function(e) {
   $(this).mapster('set',false);

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
