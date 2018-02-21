import React from 'react';
import Ball from './Ball';
import Paddle from './Paddle';

const PADDING = 50;
const Board = (props) => {
  return (
    <div className="board-container" style={{display:'flex', flexDirection: 'row', paddingLeft:'18px'}}>
      <svg className="board" style={props.styles.board}>
        {Paddle({data:{x1:PADDING, x2:PADDING, y1:props.board.paddleOne+props.board.paddleHeight/2, y2:props.board.paddleOne-props.board.paddleHeight/2 }, styles:props.styles.paddle})}
        {Paddle({data:{x1:props.styles.board.width-PADDING, x2:props.styles.board.width-PADDING, y1:props.board.paddleTwo+props.board.paddleHeight/2, y2:props.board.paddleTwo-props.board.paddleHeight/2 }, styles:props.styles.paddle})}
        {Ball({data:{cx:props.board.ballX, cy:props.board.ballY }, styles:props.styles.ball})}
      </svg>
    </div>
  )
}

export default Board;
