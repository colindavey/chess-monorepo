import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as chess_api from './chess_api.js'; 

const DIMS = 8;

const WHITE_KING = "\u2654";
const WHITE_QUEEN = "\u2655";
const WHITE_ROOK = "\u2656";
const WHITE_BISHOP = "\u2657";
const WHITE_KNIGHT = "\u2658";
const WHITE_PAWN = "\u2659";
const BLACK_KING = "\u265A";
const BLACK_QUEEN = "\u265B";
const BLACK_ROOK = "\u265C";
const BLACK_BISHOP = "\u265D";
const BLACK_KNIGHT = "\u265E";
const BLACK_PAWN = "\u265F";
const pieceLookup = {
    K: WHITE_KING,
    Q: WHITE_QUEEN,
    R: WHITE_ROOK,
    B: WHITE_BISHOP,
    N: WHITE_KNIGHT,
    P: WHITE_PAWN,
    k: BLACK_KING,
    q: BLACK_QUEEN,
    r: BLACK_ROOK,
    b: BLACK_BISHOP,
    n: BLACK_KNIGHT,
    p: BLACK_PAWN,
}

const Square = ({onClick, piece, highlighted, colorClass}) => {
    const highlightClass = highlighted ? "square-highlighted" : '';
    return (
        <button className={`square ${highlightClass} ${colorClass}`} onClick={onClick}>
            {piece}
        </button>
    ); 
}

const Board = ({position, turn, onMove, legalMoves}) => {
    const [reverse, setReverse] = useState(false);
    const [click1, setClick1] = useState(null)
    const [legalDests, setLegalDests] = useState([])

    const renderSquare = (piece, boardCoord) => {
        const clicked = click1 ? (boardCoord.row === click1.row && boardCoord.col === click1.col) : false;
        const highlighted = click1 && (clicked || legalDests.includes(boardCoord2uci(boardCoord)))
        const colorClass = (boardCoord.row % 2 === boardCoord.col % 2) ? "square-black" : "square-white"

        return (
            <Square
                key={boardCoord2key(DIMS, boardCoord)}
                piece={piece}
                onClick={() => handleClick(boardCoord)}
                highlighted={highlighted}
                colorClass={colorClass}
            />
        );
    }

    const handleClick = (boardCoord) => {
        if (piece2Color(position[boardCoord.row][boardCoord.col]) === turn) {
            setClick1(boardCoord)
            const legalDests = getLegalDestsFrom(boardCoord, legalMoves);
            console.log("legalDests", legalDests)
            setLegalDests(legalDests)
        } else {
            if (!click1) {
                return
            }
            if (legalDests.includes(boardCoord2uci(boardCoord))) {
                onMove(click1, boardCoord);
            }
            setClick1(null)
        }
    }

    const renderRow = (row, rowInd, reverse) => {
        const [startInd, endInd, indStep] = !reverse ? [0, DIMS, 1] : [DIMS-1, -1, -1]
        let rowElement = [];

        for (let colInd=startInd; colInd !== endInd; colInd += indStep) {
            rowElement.push(renderSquare(pieceLookup[row[colInd]], {row: rowInd, col: colInd}))
        }
        return (
            <div key={100+rowInd} className="board-row">
                {rowElement}
            </div>
        )
    }

    const renderBoard = () => {
        // Really need the old school loops - reversing causes problems, as does auto
        // generation of index with forEach
        const [startInd, endInd, indStep] = reverse ? [0, DIMS, 1] : [DIMS-1, -1, -1]
        let boardElement = [];
    
        for (let rowInd=startInd; rowInd !== endInd; rowInd += indStep) {
            boardElement.push(renderRow(position[rowInd], rowInd, reverse))
        }
        return boardElement;
    }

    const handleReverseClick = (reverseIn) => {
        setReverse(reverseIn)
    }

    return (
        <>
            <button onClick={() => handleReverseClick(!reverse)}>
                    {reverse ? '^' : 'v'}
            </button>
            <div className="game-board">
                {renderBoard()}
            </div>
        </>
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
        <div className="scroll">
            <div className="grid-top-row">
                <div className="grid-cell grid-cell-button" onClick={() => handleClick(0)}>Starting position</div>
            </div>
            {listing}
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
            <Board
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

function boardCoord2key(nDims, boardCoord) {
    return (nDims * boardCoord.row) + boardCoord.col
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
