import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import Game from "./game"
import { DumbBoard } from 'components'
import * as chessApi from 'components' 

const BoardClicker = () => {
    const handleClick = boardCoord => console.log('click', boardCoord)
    const highlightList = []
    const position = chessApi.emptyPosition
    return (
        <DumbBoard
        position={position}
        highlightList={highlightList}
        handleClick={handleClick}
        />
    )
}

ReactDOM.render(
    <BoardClicker/>,
    document.getElementById('root')
);

