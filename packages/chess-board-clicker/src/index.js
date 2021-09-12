import React from 'react';
import ReactDOM from 'react-dom';
import 'chess-monorepo-components/src/styles.css';
import { DumbBoard } from 'chess-monorepo-components'
import * as chessApi from 'chess-monorepo-components' 

const BoardClicker = () => {
    const handleClick = (_e, boardCoord) => console.log('click', boardCoord)
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

