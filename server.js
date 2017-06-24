var express = require('express');
var bodyParser=require('body-parser')
var app= express();
var httpserver=require('http').Server(app);
var io= require('socket.io')(httpserver);
var session = require('express-session')
var np=0;
var maxplayers=2;
var view=0;
var rInd=0;
var rooms=[];
var mapdata={1:"-1",2:"-1",3:"-1",4:"-1",5:"-1",6:"-1",7:"-1",8:"-1",9:"-1",10:"-1"};
app.use(express.static(__dirname));
app.set('view engine', 'pug');
app.use(bodyParser.json());
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {
  joined: 0,
  room: 0,
  }
}))
httpserver.listen(8000, function(){
  console.log("Server listening on port 8000");
});
app.get('/', function(req, res){
  console.log(req.sessionID);
    if(req.session.cookie.joined==1){
      console.log("UFFFF");
      res.redirect('toroom');
    }
    res.render('lobby', {title: "Lobby", number:np.toString(), maxplayers:maxplayers.toString(),values:rooms});
});
app.use(function(req,res,next){
   console.log(req.url);
   next();
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

app.get('/toroom', function(req, res,next){
  console.log(req.session.cookie.room);
  req.session.cookie.joined=1;
  if(!req.query.room){
    console.log("UI");
  req.session.cookie.room=parseInt(req.query.room,10);};
  if(!rooms[req.query.room]){
    next();
  };
  res.render('room',
      {
        title: "Room "+req.session.cookie.room,
        players:rooms[req.session.cookie.room].players,
        maxplayers:rooms[req.session.cookie.room].maxplayers,
        roomname:rooms[req.session.cookie.room].roomname
      });
  });
 io.sockets.on('connection', function(socket){
   socket.on('userjoin',function(room){
     socket.join(room);
     socket.to(room).emit('mycolor',{color: rooms[parseInt(room,10)].players.toString()});
     rooms[parseInt(room,10)].players++;
     //console.log(rooms[parseInt(room,10)].players+" room:"+room);
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
 app.use('/toroom',(req,res)=>{
   res.send('No such room');
 });
app.use((req,res)=>{
  res.send('404');
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

/* ode for generating the map
var a=83, b=384, c=83,d=384;
for(j=0;j<20;j++){
for(i=0;i<20-j;i++){
if(j==0){
	generate(a,b);
	a+=60;
}
else{
	generate(a,b);
	generate(a,d);
	a+=60;
}
}
c+=30;
a=c;
b+=17.32;
d-=17.32;
}
function generate(a,b){
console.log('area(data-key="" alt="" title="" href="#" 			shape="poly" 		coords="'+a+','+b+','+(a+10)+','+(b+17.32)+','+(a+30)+','+(b+17.32)+','+		(a+40)+','+b+','+(a+30)+','+(b-17.32)+','+(a+10)+','+(b-17.32)+'")/');
}
*/
