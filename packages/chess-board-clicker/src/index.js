import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import 'chess-monorepo-components/src/styles.css';
import { DumbBoard } from 'chess-monorepo-components'
import * as chessApi from 'chess-monorepo-components' 
import * as chessUtils from 'chess-monorepo-components' 

const BoardClicker = () => {
    const [message, setMessage] = useState('')
    const handleClick = (_e, boardCoord) => setMessage(`row ${boardCoord.row}, col ${boardCoord.col}: ${chessUtils.boardCoord2uci(boardCoord)}`)
    const position = chessApi.emptyPosition
    return (
        <DumbBoard
            position={position}
            handleClick={handleClick}
            message={message}
        />
    )
}

ReactDOM.render(
    <BoardClicker/>,
    document.getElementById('root')
);

