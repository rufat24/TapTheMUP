$(document).ready(function() {
  var a=[];
/*  $('img').mousedown(function(e) {
   $(this).mapster({
     fillOpacity: 0.4,
     fillColor: "d42e16",
   });
});*/


$('area').mousedown(function(e) {
   $(this).mapster('set',false);
});

$('img').mapster({
  fillOpacity:1,
  fillColor: "d42e16",
  stroke: true,
  strokeColor: "000",
  strokeOpacity: 0.8,
  strokeWidth: 4
});
});
