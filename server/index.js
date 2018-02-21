var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var updateBoard = require('./updateBoard');

var PORT = 8000;
var boardHeight = 600;
var boardWidth = 800

var FPS = 30;

var userList = []
var board = {
  boardHeight,
  boardWidth,
  ballR:20,
  ballX: boardWidth/2,
  ballY: boardHeight/2,
  vx:5*(Math.floor(2*Math.random())-0.5),
  vy:5*(Math.floor(2*Math.random())-0.5),
  paddleOne: boardHeight/2,
  paddleTwo: boardHeight/2,
  paddleWidth: 20,
  paddleHeight: 160,
  paddleSpeed: 5,
  playerOne:{},
  playerTwo:{},
  playerOneScore:0,
  playerTwoScore:0,
  paused:true,
  p1moveup:false,
  p1movedown:false,
  p2moveup:false,
  p2movedown:false
}



io.on('connection', function(socket){
  //User has connected -- update userList and emit it
  userList.push(socket.id);
  io.sockets.emit('msg', {type:'USERS_UPDATE', payload:userList})




  socket.on('msg', (msg)=>{
    switch(msg.type) {
      case 'TOGGLE_PLAY':
        board.paused = !board.paused;
        break;
      case 'JOIN':
        //handle joins
        if(msg.player === 1 && Object.keys(board.playerOne).length === 0 && board.playerTwo.id != msg.user.id) {
          board.playerOne = msg.user;
          io.sockets.emit('msg', {type:'GAME_UPDATE', payload: board});
          break;
        } else if (msg.player ===2 && Object.keys(board.playerTwo).length === 0 && board.playerOne.id != msg.user.id) {
          board.playerTwo = msg.user;
          io.sockets.emit('msg', {type:'GAME_UPDATE', payload: board});
          break;
        }
        //handle quits
        if(msg.player === 1 && board.playerOne.id === msg.user.id) {
          board.playerOne = {};
          io.sockets.emit('msg', {type:'GAME_UPDATE', payload: board});
          break;
        } else if (msg.player === 2 && board.playerTwo.id === msg.user.id) {
          board.playerTwo = {};
          io.sockets.emit('msg', {type:'GAME_UPDATE', payload: board});
          break;
        }
        break;
      case 'MOVE':
        if(msg.payload.player === 1) {
          if(msg.payload.direction ==='UP' && board.p1moveup === false) {
              board.p1moveup = true;
          }
          if(msg.payload.direction ==='up' && board.p1moveup === true) {
              board.p1moveup = false;
          }
          if(msg.payload.direction ==='DOWN' && board.p1movedown === false) {
              board.p1movedown = true;
          }
          if(msg.payload.direction ==='down' && board.p1movedown === true) {
              board.p1movedown = false;
          }
        }
        if(msg.payload.player === 2) {
          if(msg.payload.direction ==='UP' && board.p2moveup === false) {
              board.p2moveup = true;
          }
          if(msg.payload.direction ==='up' && board.p2moveup === true) {
              board.p2moveup = false;
          }
          if(msg.payload.direction ==='DOWN' && board.p2movedown === false) {
              board.p2movedown = true;
          }
          if(msg.payload.direction ==='down' && board.p2movedown === true) {
              board.p2movedown = false;
          }
        }
        break;
      case 'MSG':
        socket.broadcast.emit('msg', {type:'RELAY', msg:msg.msg, id:msg.id, name: msg.name, time:msg.time})
        break;
      case 'IS_TYPING':
        socket.broadcast.emit('msg', msg)
        break;
      case 'IS_NOT_TYPING':
        socket.broadcast.emit('msg', msg)
        break;
      default:
        break;
    }
  })

  socket.on('disconnect', function() {
      //user has disconnected -- update userList and emit it
      userList.splice(userList.indexOf(socket.id),1)
      
      //remove user from board players if, post boardupdate
      if(board.playerOne.id === socket.id) {
        board.playerOne = {} 
        io.sockets.emit('msg', {type:'USERS_UPDATE', payload:board})
      }
      if(board.playerTwo.id === socket.id){
        board.playerTwo = {}
        io.sockets.emit('msg', {type:'GAME_UPDATE', payload: board});
      } 
      

  })
});

var lastTrigger = false;

var gameInterval = setInterval( ()=>{
  if(!board.paused) {  
    updateBoard(board);
    io.sockets.emit('msg', {type:'GAME_UPDATE', payload: board});
    lastTrigger = false;
  }
  if(board.paused == true && lastTrigger == false) {
    //send last frame after pause so board.paused is updated
    lastTrigger = true;
    io.sockets.emit('msg', {type:'GAME_UPDATE', payload: board});
  }

}, 1000/FPS)

http.listen(PORT, function(){
  console.log(`listening on ${PORT}`);
});
