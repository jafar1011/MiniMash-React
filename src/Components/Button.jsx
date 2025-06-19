import React from 'react';
import './Button.css';

function Button({ label, icon, onClick, style, iconStyle }) {
  return (
    <button className="game-button" onClick={onClick} style={style}>
      {icon && (
        <img
          src={icon}
          alt={label}
          className="button-icon"
          style={iconStyle}
        />
      )}
      {label}
    </button>
  );
}

export default Button;