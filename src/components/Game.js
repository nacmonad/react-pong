import React, { Component } from 'react';
import io from 'socket.io-client';

import Board from './Board';
import ChatBox from './ChatBox';

import ToggleButton from './ToggleButton';
import IconButton from 'material-ui/IconButton';

import AddCircleOutline from 'material-ui-icons/AddCircleOutline';
import RemoveCircle from 'material-ui-icons/RemoveCircle';


class Game extends Component {
  constructor(props){
    super(props);
    this.state = {
      pid:"",
      name:"Anonymous",
      playerList : [],
      board: {
        ballX:400,
        ballY:300,
        ballR:20,
        paddleOne:300,
        paddleTwo:300,
        paddleHeight:160,
        playerOne:{},
        playerTwo:{},
        playerOneScore:0,
        playerTwoScore:0,
        paused:true,
        p1moveup:false,
        p1movedown:false,
        p2moveup:false,
        p2movedown:false
      },
      chat: {
          msg:"",
          history:[],
          isTyping:false
        }
      }
  }
      

  //without redux actions, can't set this centralized state from the chatbox component, therefore bind functions
  //with the scope of 'this' to the props of the ChatBox

  handleChange = (name) => (event) => {
    
    if(event.target.value.length > 0 && this.state.chat.msg.length === 0) {
      //first key stroke
      this.setState({chat:{msg:event.target.value, history:this.state.chat.history, isTyping:true }});
      this.socket.emit('msg', {type:'IS_TYPING', id:this.socket.id, name:this.state.name});
    } else if (event.target.value.length === 0) {
      this.setState({ msg:event.target.value, isTyping:false, history:this.state.chat.history});
      this.socket.emit('msg', {type:'IS_NOT_TYPING', id:this.socket.id, name:this.state.name });
    } else {
      this.setState({chat:{msg:event.target.value, history:this.state.chat.history, isTyping:false}});
    }


  }

  handleReturn = (name) => (event) => {
    if(event.key === 'Enter') {
      event.preventDefault();
      //send message
      //clear input field if there is input, add to history
      if(this.state.chat.msg.length !== 0) {
        this.setState({chat:{msg:"", history:[{msg:event.target.value, id:this.socket.id, name:this.state.name, time:new Date()},...this.state.chat.history], isTyping:false}})
        this.socket.emit('msg', {type:'MSG', id:this.socket.id, name:this.state.name, msg:event.target.value, time:new Date()});
        this.socket.emit('msg', {type:'IS_NOT_TYPING', id:this.socket.id, name:this.state.name });
        event.target.value = "";
      }
      
    }
  }

  componentDidMount(){
    const socket = io('http://localhost:8000');
    //event handlers for game and chat

    socket.on('msg', function(msg) {
      switch(msg.type){
        case 'USERS_UPDATE':
          updateHelper({playerList:msg.payload})
          break;
        case 'GAME_UPDATE':
          updateHelper({board:{pid:socket.id, ...msg.payload}})
          break;
        case 'RELAY':
          updateChat({msg})         
          break;
        case 'IS_TYPING':
          console.log(msg)
          break;
        case 'IS_NOT_TYPING':
          console.log(msg)
          break;
        default:
          break;
      }
    })
    //this f(x) has the react component's scope, for use inside of socket callback
    const updateHelper = (m)=>{
      this.setState(m)
    }
    const updateChat = (m)=> {
      this.setState({chat:{msg:this.state.chat.msg, history:[ {msg:m.msg.msg, name:m.msg.name, id:m.msg.id, time:m.msg.time},...this.state.chat.history], isTyping:this.state.chat.isTyping}})
    }
    //bind this to updateHelper
    //bind the socket to this
    this.socket = socket
  }

  handleKeyUp(e) {
    if(this.socket.id === this.state.board.playerOne.id) {
      
      if((e.keyCode === 87 || e.keyCode === 38)) {
        this.socket.emit('msg', {type:'MOVE', payload: {direction:'up',player:1}});
      }
      if((e.keyCode === 83 || e.keyCode === 40)) {
        this.socket.emit('msg', {type:'MOVE', payload: {direction:'down',player:1}});
      }
    } else if(this.socket.id === this.state.board.playerTwo.id) {
        
       if((e.keyCode === 87 || e.keyCode === 38)) {
        this.socket.emit('msg', {type:'MOVE', payload: {direction:'up',player:2}});
      }
      if((e.keyCode === 83 || e.keyCode === 40)) {
        this.socket.emit('msg', {type:'MOVE', payload: {direction:'down',player:2}});
      }
    }

  }
  handleKeyDown(e) {
    if(this.socket.id === this.state.board.playerOne.id) {
      if(e.keyCode === 87 || e.keyCode === 38) {

      this.socket.emit('msg', {type:'MOVE', payload: {direction:'UP',player:1}});
      }
      if(e.keyCode === 83 || e.keyCode === 40) {
        this.socket.emit('msg', {type:'MOVE', payload: {direction:'DOWN',player:1}});
      }
    } else if(this.socket.id === this.state.board.playerTwo.id) {
      
      if(e.keyCode === 87 || e.keyCode === 38) {
        this.socket.emit('msg', {type:'MOVE', payload: {direction:'UP',player:2}});
      }
      if(e.keyCode === 83 || e.keyCode === 40) {
        this.socket.emit('msg', {type:'MOVE', payload: {direction:'DOWN',player:2}});
      }
    }

    


  }



  handleJoin(i) {
    this.socket.emit('msg', {type:'JOIN', player: i, user:{id:this.socket.id, name:this.state.name}})
  }
  render() {
    const styles = {
      board : {
        width: 800,
        height: 600,
        backgroundColor: 'black',
        marginBottom:50
      },
      ball : {
        fill:'chartreuse',
        r:20,
        stroke:'chartreuse',
        strokeWidth:2
      },
      paddle: {
        stroke:'chartreuse',
        strokeWidth:20,
        strokeLinecap:'round'
      }
    }
    return (
      <div>
        <div className="Game" onKeyUp={this.handleKeyUp.bind(this)} onKeyDown={this.handleKeyDown.bind(this)}>
            <h4>uses keyboard input, please use desktop</h4>
            <div className="scoreTable">
            <IconButton className="join-button" aria-label="Delete" onClick={this.handleJoin.bind(this,1)}>
              {(this.socket && this.state.board.playerOne.id === this.socket.id) ? (<RemoveCircle/>) : (<AddCircleOutline /> )}
            </IconButton> <b>PlayerOne:</b> { this.state.board.playerOneScore }
              <br/>
            <IconButton className="join-button" aria-label="Delete" onClick={this.handleJoin.bind(this,2)}>
              {(this.socket && this.state.board.playerTwo.id === this.socket.id) ? (<RemoveCircle/>) : (<AddCircleOutline /> )}
            </IconButton> <b>PlayerTwo:</b> { this.state.board.playerTwoScore }
              <br/>
            </div>
            <ToggleButton paused={this.state.board.paused} socket={this.socket}/>
            <br/>
            <Board styles={styles} board = {this.state.board} />
        </div>
        <ChatBox chat={this.state.chat} board= {this.state.board} handleChange={this.handleChange.bind(this)} handleReturn={this.handleReturn.bind(this)}/>
      </div>
    );
  }
}

export default Game;
