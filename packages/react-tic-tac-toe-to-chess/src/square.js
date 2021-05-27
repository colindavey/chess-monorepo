import React from 'react';

const Square = ({onClick, piece, highlighted, colorClass}) => {
    const highlightClass = highlighted ? "square-highlighted" : '';
    return (
        <button className={`square ${highlightClass} ${colorClass}`} onClick={onClick}>
            {piece}
        </button>
    ); 
}

export default Square;