const reset = (board)=> {
  board.ballX = board.boardWidth/2;
  board.ballY = board.boardHeight/2;
  board.vx = 5*(Math.floor(2*Math.random())-0.5);
  board.vy = 5*(Math.floor(2*Math.random())-0.5);
}

module.exports = (board)=>{
  //move ball
  board.ballX+=board.vx;
  board.ballY+=board.vy;

  //move paddleSpeed
  if(board.p1moveup && (board.paddleOne > board.paddleHeight/2)) board.paddleOne -= board.paddleSpeed;
  if(board.p1movedown && (board.paddleOne < board.boardHeight-board.paddleHeight/2)) board.paddleOne += board.paddleSpeed;
  if(board.p2moveup && (board.paddleTwo > board.paddleHeight/2)) board.paddleTwo -= board.paddleSpeed;
  if(board.p2movedown && (board.paddleTwo < board.boardHeight-board.paddleHeight/2)) board.paddleTwo += board.paddleSpeed;

  //paddleOne detect
if(board.ballX+board.ballR > 100-board.paddleWidth/2 && board.ballX+board.ballR < 100+board.paddleWidth/2 && board.ballY > board.paddleOne-board.paddleHeight/2 && board.ballY < board.paddleOne+board.paddleHeight/2)  {
      board.vx*=-1.01;

  }
  //paddleTwo detect
  if(board.ballX-board.ballR > (board.boardWidth-100)-board.paddleWidth/2 && board.ballX - board.ballR< (board.boardWidth-100)+board.paddleWidth/2 && board.ballY > board.paddleTwo-board.paddleHeight/2 && board.ballY < board.paddleTwo+board.paddleHeight/2) {
      board.vx*=-1;

    }

  //boundary detect
  if(board.ballY > board.boardHeight - board.ballR || board.ballY < board.ballR) board.vy*=-1

  //score detect
  if(board.ballX > board.boardWidth - board.ballR ) {
   board.playerOneScore++;
   reset(board)
  }
  if(board.ballX < board.ballR) {
    board.playerTwoScore++;
    reset(board);
  }
}
