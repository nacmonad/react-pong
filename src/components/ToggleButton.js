import React from 'react';
import Button from 'material-ui/Button';

var bang = (socket)=>{
  socket.emit('msg', {type:'TOGGLE_PLAY'})
}

export default (props) => {
  return (
    <Button raised="true" color="primary" style={{marginBottom:'10px'}} onClick={bang.bind(null, props.socket)}>
      {props.paused ? <span>Play</span> : <span>Pause</span>  }
    </Button>
  );
}
