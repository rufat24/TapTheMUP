var express = require('express');
var app= express();
var httpserver=require('http').Server(app);
var io= require('socket.io')(httpserver);


app.use(express.static(__dirname));
app.set('view engine', 'pug');
app.get('/', function(req, res){
  res.render('lobby', {title: "Lobby"});
});

httpserver.listen(8000, function(){
  console.log("Server listening on port 8000")
});
app.listen(8001, function(){
  console.log("express listening on port 8001")
});

 io.on('connection', function(socket){
   console.log('a user connected');
 });
