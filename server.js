var express = require('express');
var app= express();
var httpserver=require('http').Server(app);
var io= require('socket.io')(httpserver);
var np=0;
var maxplayers=2;
var mapdata={1:"0",2:"0",3:"0",4:"0",5:"0",6:"0",7:"0",8:"0",9:"0",10:"0"};
app.use(express.static(__dirname));
app.set('view engine', 'pug');

httpserver.listen(8000, function(){
  console.log("Server listening on port 8000");
});
app.get('/', function(req, res){
  res.render('lobby', {title: "Lobby", number:np.toString()});
});


 io.sockets.on('connection', function(socket){
   io.emit('numplayers',{num: np.toString(), start: "0"})
   socket.on('userjoin',function(){
     np++;
     socket.emit('mycolor',{color:(np-1).toString()});
     console.log(np.toString());
     if(np==maxplayers){
       io.emit('numplayers',{num: np.toString(),start:'1'});
     }
     else{
       io.emit('numplayers',{num: np.toString(),start:'0'});
     }

   });
   socket.on('click',function(data){
     console.log(data);
     mapdata[data.change]=data.color;
     console.log(mapdata);
     socket.broadcast.emit('redraw',{change:data.change,color:data.color});
   });

 });
