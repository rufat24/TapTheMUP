$(document).ready(function() {
  var h=1;
  var a=[];
  $('.join').live('click',function() {
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
/*   if(h%2==0){
     $('img').mapster({
       fillOpacity:1,
       fillColor: "0000ff",
       stroke: true,
       strokeColor: "000",
       strokeOpacity: 0.8,
       strokeWidth: 4
     });}

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
