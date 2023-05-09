import React from 'react';

const Header = () => {
  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'end',
        backgroundColor: 'black',
        color: 'white',
        padding: '10px',
        paddingLeft: 0, // Remove left padding
        marginLeft: 0, // Remove left margin
      }}
    >
      <div style={{ marginRight: '10px', cursor: 'pointer' }} onClick={() => console.log('Profile clicked')}>
        Profile
      </div>
      <div style={{ cursor: 'pointer' }} onClick={() => console.log('Logout clicked')}>
        Logout
      </div>
    </header>
  );
};

export default Header;
