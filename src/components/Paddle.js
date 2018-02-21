import React from 'react';

const Paddle = (props) => {
  return (
    <line {...props.data} {...props.styles}></line>
  )
}

export default Paddle;
