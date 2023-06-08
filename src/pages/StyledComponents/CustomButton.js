import React from 'react';
import Button from '@mui/material/Button';

const CustomButton = ({ variant, text, color, onClick }) => {
  let buttonStyle = {};

  if (variant === 'cancel_button') {
    buttonStyle = {
      backgroundColor: 'gray',
      color: 'white',
    };
  } else if (variant === 'save_button') {
    buttonStyle = {
      backgroundColor: '#025BAD',
      color: 'white',
    };
  }

  const buttonTextStyle = {
    fontFamily: 'Poppins',
  };


  return (
    <Button
      variant="contained"
      style={{ ...buttonStyle, ...buttonTextStyle }}
      color={color}
      onClick={onClick}
    >
      {text}
    </Button>
  );
};

export default CustomButton;
