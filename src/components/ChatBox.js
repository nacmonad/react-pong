import React from 'react';
import TextField from 'material-ui/TextField';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Identicon from 'identicon.js';



// avatar set up options
var avOptions = {
      foreground: [0, 0, 0, 255],               // rgba black
      background: [255, 255, 255, 255],         // rgba white
      margin: 0.2,                              // 20% margin
      size: 20,                                // 420px square
      format: 'svg'                             // use SVG instead of PNG
    };

// create a base64 encoded SVG
//var data = new Identicon(hash, avOptions).toString();

const ChatBox = (props) =>{

  return (
     <div style = {{position:'absolute', bottom:'0px', right:'0px', width:'40%'}}>
        <div style = {{width:'100%', height:'480px', overflowY:'scroll'}}>
          <List>
            {props.chat.history.map( (value, index) => (
              <ListItem key={index} dense button >
                <img alt="avatar" width={20} height={20} src={`data:image/svg+xml;base64,${new Identicon(value.id, avOptions).toString()}`}/>  
                <em>{props.board.pname}</em>
                <ListItemText primary={`${value.msg}`} />

              </ListItem>
            ))}
          </List>
        </div>
          <form className="msg-box" noValidate autoComplete="off" submit="false" style={{width:'100%'}}>
            <TextField
              id="msg"
              label="msg"
              className="msg-field"
              onChange={props.handleChange("msg")}
              onKeyPress={props.handleReturn("msg")}
              margin="normal"
              style={{width:'96%'}}
            />
         </form>
        </div>
        )

};


export default ChatBox;