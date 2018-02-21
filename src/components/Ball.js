import React from 'react';

const Ball = (props) => {
  return (
    <circle {...props.data} {...props.styles}></circle>
  )
}

export default Ball;
