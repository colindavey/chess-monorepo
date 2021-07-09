import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import {DumbBoard} from "components"
import './index.css';
import * as chess_api from './chess_api.js'; 

const SmartBoard = ({position, turn, onMove, legalMoves}) => {
    const [click1, setClick1] = useState(null)
    const [legalDests, setLegalDests] = useState([])
    const [highlightList, setHighlightList] = useState([])

    const handleClick = (boardCoord) => {
        if (piece2Color(position[boardCoord.row][boardCoord.col]) === turn) {
            setClick1(boardCoord)
            const legalDests = getLegalDestsFrom(boardCoord, legalMoves);
            setLegalDests(legalDests)
            const highlightList = legalDests
            highlightList.push(boardCoord2uci(boardCoord))
            setHighlightList(highlightList)
        } else {
            if (!click1) {
                return
            }
            if (legalDests.includes(boardCoord2uci(boardCoord))) {
                onMove(click1, boardCoord);
            }
            setClick1(null)
            setHighlightList([])
        }
    }

    return (
        <DumbBoard
            position={position}
            highlightList={highlightList}
            handleClick={handleClick}
        />
    );
}

const ChessListingGrid = ({moves, currentMoveNum, handleClick}) => {
    let tableMoves = []
    for (let i=0; i < moves.length; i+=2) {
        tableMoves.push([
            {move: moves[i], index: i},
            moves[i+1] ? {move: moves[i+1], index: i+1} : ''
        ])
    }

    const renderCol = (row, row_index) => {
        return row.map((col, col_index) => {
            const index = `${row_index},${col_index}`
            const move = col.index+1===currentMoveNum ? <b>{col.move}</b> : col.move
            return col
                ?
                    <div key={index} className="grid-cell grid-cell-button" onClick={() => handleClick(col.index+1)}>{move}</div> 
                :
                    <div key={index} className="grid-cell"></div> 
        })
    }

    const listing = tableMoves.map((row, index) => {
        const newCol = renderCol(row, index)
        return (
            <div key={index} className="grid-wrapper">
                <div className="grid-cell">
                    {index+1}.
                </div>
                {newCol}
            </div>
        )
    })

    return (
        <div>
            <div className="scroll">
                {listing}
            </div>
            <button onClick={() => handleClick(0)}>|&#60;</button>
            <button onClick={() => handleClick(Math.max(currentMoveNum-1, 0))}>&#60;</button>
            <button onClick={() => handleClick(Math.min(currentMoveNum+1, moves.length))}>&#62;</button>
            <button onClick={() => handleClick(moves.length)}>&#62;|</button>
        </div>
    )
}

const GameInfo = ({moves, currentMoveNum, handleListingClick}) => {
    // const winner = calculateWinner(DIMS, history[currentMoveNum].squares);
    // let status;
    // if (winner) {
    //     status = 'Winner: ' + winner.winner;
    // } else if (currentMoveNum === DIMS*DIMS) {
    //     status = "Draw";
    // } else {
    //     status = 'Next player: ' + moveNum2Color(currentMoveNum);
    // }
    let status;
    status = 'Next player: ' + moveNum2Color(currentMoveNum);

    return (
        <div className="game-info">
            {status}
            <ChessListingGrid
                moves={moves} 
                currentMoveNum={currentMoveNum} 
                handleClick={handleListingClick} 
            />
        </div>
    )
}

const Game  = ({position, currentMoveNum, legalMoves, moves, handleMove, handleListingClick}) => {
    return (
        <div className="game">
            <SmartBoard
                position={position}
                turn={moveNum2Color(currentMoveNum)}
                onMove={handleMove}
                legalMoves={legalMoves}
            />
            <GameInfo
                moves={moves}
                currentMoveNum={currentMoveNum} 
                handleListingClick={handleListingClick} 
            />
        </div>
    );
}

const App  = () => {
    const initGameState = chess_api.init();
    // const [gameState, setGameState] = useState(initGameState);
    const [moves, setMoves] = useState([]);
    const [currentMoveNum, setCurrentMoveNum] = useState(0);
    const [position, setPosition] = useState(initGameState.position)
    const [legalMoves, setLegalMoves] = useState(initGameState.legal_moves)

    // Should only get here if legal move has been made
    const handleMove = (click1, click2) => {
        const local_moves = moves.slice(0, currentMoveNum)
        const chessApiState = chess_api.move_add(local_moves, `${boardCoord2uci(click1)}${boardCoord2uci(click2)}`);
        setMoves(chessApiState.moves);
        updateState(chessApiState, local_moves.length+1);
    }

    const handleListingClick = (moveNum) => {
        const chessApiState = chess_api.move_to(moves.slice(0, moveNum));
        // setMoves(chessApiState.moves);
        updateState(chessApiState, moveNum);
    }

    const updateState = ({position, legal_moves}, moveNum) => {
        // setGameState(chessApiState);
        setPosition(position);
        setLegalMoves(legal_moves)
        setCurrentMoveNum(moveNum);
    }

    return (
        <Game
            position={position}
            turn={moveNum2Color(currentMoveNum)}
            legalMoves={legalMoves}
            moves={moves}
            currentMoveNum={currentMoveNum} 
            handleMove={handleMove}
            handleListingClick={handleListingClick} 
        />
    );
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);

// ========================================

function piece2Color(piece) {
    if (!piece) {
        return null;
    }
    return piece.toUpperCase() === piece ? 'W' : 'B'
}

function moveNum2Color(moveNum) {
    return ((moveNum % 2) === 0) ? 'W' : 'B';
}

function boardCoord2uci(boardCoord) {
    const file = String.fromCharCode('a'.charCodeAt()+boardCoord.col)
    const rank = boardCoord.row+1;
    return `${file}${rank}`;
}

// function uci2boardCoord(uci) {
//     return {row: parseInt(uci.slice(1))-1, col: uci.slice(0, 1).charCodeAt() - "a".charCodeAt()}
// }

function getLegalDestsFrom(boardCoord, legalMoves) {
    const startCoord = boardCoord2uci(boardCoord);
    // filter the legal moves down to those starting from the boardCoord
    const legalMovesFiltered = legalMoves.filter( m => m.slice(0, 2) === startCoord );
    // e.g. maps ["e2e3", "e2e4"] to ["e3", "e4"] 
    const legalDests = legalMovesFiltered.map( m => m.slice(2));
    return legalDests
}
