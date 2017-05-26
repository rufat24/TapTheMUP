var express = require('express');
var bodyParser=require('body-parser')
var app= express();
var httpserver=require('http').Server(app);
var io= require('socket.io')(httpserver);
var np=0;
var maxplayers=2;
var view=0;
var rooms=[];
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

app.post('/createroom', function(req, res){
    var ind=rooms.length;
    rooms.push({
      maxplayers: req.body.players,
      roomname: req.body.roomname,
      players: 0
    });
    res.send('complete');
});
app.post('/toroom', function(req, res){
    var rInd=parseInt(req.body.room,10);
    console.log(rInd);
    res.render('room',
      {
        title: "Room "+rInd.toString(),
        number:rooms[rInd].players,
        maxplayers:rooms[rInd].maxplayers,
        roomname:rooms[rInd].roomname
      },function(err, result) {
    console.log('Render result:');
    console.log(result);
    res.send(JSON.stringify(result));
    });
  });
 io.sockets.on('connection', function(socket){
   socket.on('userjoin',function(room){
     socket.join(room);
     socket.to(room).emit('mycolor',{color: rooms[parseInt(room,10)].players.toString()});
     rooms[parseInt(room,10)].players++;
     console.log(rooms[parseInt(room,10)].players+" room:"+room);
     /*if(np==maxplayers){
       io.emit('numplayers',{num: np.toString(),start:'1'});
     }
     else{
       io.emit('numplayers',{num: np.toString(),start:'0'});
     }*/

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
   socket.on('roomview',function(data){

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
