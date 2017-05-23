var express = require('express');
var bodyParser=require('body-parser')
var app= express();
var httpserver=require('http').Server(app);
var io= require('socket.io')(httpserver);
var np=0;
var maxplayers=2;
var rooms=[];
var rms=[]
var mapdata={1:"-1",2:"-1",3:"-1",4:"-1",5:"-1",6:"-1",7:"-1",8:"-1",9:"-1",10:"-1"};
app.use(express.static(__dirname));
app.set('view engine', 'pug');
app.use(bodyParser.json());
httpserver.listen(8000, function(){
  console.log("Server listening on port 8000");
});
app.get('/', function(req, res){
    res.render('lobby', {title: "Lobby", number:np.toString(), maxplayers:maxplayers.toString(),values:rooms});
});

app.post('/room', function(req, res){
    var ind=rooms.length;
    console.log("a");
    rooms.push({
      maxplayers: req.body.players,
      roomname: req.body.roomname,
      players: "0"
    });
    rms[ind]=io.of(ind.toString());
    res.send('complete');
});
 io.sockets.on('connection', function(socket){
   socket.on('userjoin',function(data){
     socket.join(data.room);
     rooms[parseInt(data.room,10)]
     socket.to(data.room).emit('mycolor',{color:(np-1).toString()});
     console.log(np.toString());
     if(np==maxplayers){
       io.emit('numplayers',{num: np.toString(),start:'1'});
     }
     else{
       io.emit('numplayers',{num: np.toString(),start:'0'});
     }

   });
   socket.on('click',function(data){
     mapdata[data.change]=data.color;
     io.emit('redraw',mapdata);
     if(winner(parseInt(data.color,10))){
       mapdata={1:"-1",2:"-1",3:"-1",4:"-1",5:"-1",6:"-1",7:"-1",8:"-1",9:"-1",10:"-1"};
       io.emit('winner', {color:parseInt(data.color,10)})
       np=0;
     }
   });
   socket.on('reset',function(){
     if(np==maxplayers){
       socket.emit('numplayers',{num: np.toString(),start:'2'});
     }
     else{
       socket.emit('numplayers',{num: np.toString(),start:'3'});
     }
   });


 });


   function winner(colorInd){
     var win=0;
      for (var areas in mapdata) {
        if (parseInt(mapdata[areas],10)==colorInd) {
            win++;
        }
      }
      if(win==10) return true;
      return false
   }
