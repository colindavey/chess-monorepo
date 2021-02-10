import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const dims = 8;
// const dims = 5;

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
const initPosition = 
[
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
]

const Square = ({onClick, piece, highlighted, colorClass}) => {
    const highlightClass = highlighted ? "square-highlighted" : '';
    return (
        <button className={`square ${highlightClass} ${colorClass}`} onClick={onClick}>
            {piece}
        </button>
    ); 
}

const Board = ({squares, reverse, onClick, highlightedSquares}) => {
    const renderSquare = (piece, boardCoord) => {
        const highlighted = highlightedSquares ? (boardCoord.row === highlightedSquares.row && boardCoord.col === highlightedSquares.col) : false;
        const colorClass = (boardCoord.row % 2 === boardCoord.col % 2) ? "square-black" : "square-white"

        return (
            <Square
                key={boardCoord2key(dims, boardCoord)}
                piece={piece}
                onClick={() => onClick(boardCoord)}
                highlighted={highlighted}
                colorClass={colorClass}
            />
        );
    }

    const renderRow = (row, rowNum, boardElement) => {
        const the_row =  row.map((col, colNum) => renderSquare(pieceLookup[col], {row: rowNum, col: colNum}))
        return (
            <div key={100+rowNum} className="board-row">
                {the_row}
            </div>
        )
    }

    const renderBoard = () => {
        // Really need the old school loops - reversing causes problems, as does auto
        // generation of index with forEach
        let boardElement = [];
        if (reverse) {
            for (let row=0; row < dims; row++) {
                boardElement.push(renderRow(squares[row], row))
            }
        } else {
            for (let row=dims-1; row >= 0; row--) {
                boardElement.push(renderRow(squares[row], row))
            }
        }
        return boardElement;
    }

    return (
        <div className="game-board">
            {renderBoard()}
        </div>
    );
}

const ChessListing = ({history, currentMoveNum, handleClick}) => {
    const listingItems = history.map((snapshot, moveNum) => {
        const moveNumIndex = moveNum+1
        let desc = `${moveNum2Color(moveNumIndex-1)} ${boardCoord2uci(snapshot.boardCoord1)}${boardCoord2uci(snapshot.boardCoord2)}`
        if (moveNumIndex === currentMoveNum) {
            desc = <b>{desc}</b>
        }
        return (
            <ul key={moveNumIndex}>
                {moveNumIndex}. <button onClick={() => handleClick(moveNumIndex)}>{desc}</button>
            </ul>
        );
    });
            
    return (
        <ol>
            {listingItems}
        </ol>
    )
}

const GameInfo = ({history, currentMoveNum, reverse, handleListingClick, handleReverseClick}) => {
    // const winner = calculateWinner(dims, history[currentMoveNum].squares);
    // let status;
    // if (winner) {
    //     status = 'Winner: ' + winner.winner;
    // } else if (currentMoveNum === dims*dims) {
    //     status = "Draw";
    // } else {
    //     status = 'Next player: ' + moveNum2Color(currentMoveNum);
    // }
    let status;
    status = 'Next player: ' + moveNum2Color(currentMoveNum);

    const startButton = 
    (
        <ul key="0">
            <button onClick={() => handleListingClick(0)}>Game start</button>
        </ul>
    )

    return (
        <div className="game-info">
            <div>
                {status}&nbsp;
                <button onClick={() => handleReverseClick(!reverse)}>
                    {reverse ? '^' : 'v'}
                </button>
                {startButton}
            </div>
            <ChessListing
                history={history.slice(1)} 
                currentMoveNum={currentMoveNum} 
                handleClick={handleListingClick} 
            />
        </div>
    )
}

const Game  = () => {
    const [reverse, setReverse] = useState(false);
    const [history, setHistory] = useState(
        [{
            // squares: init2DimArray(dims),
            squares: initPosition,
            boardCoord1: null,
            boardCoord2: null,
        }])
    const [currentMoveNum, setCurrentMoveNum] = useState(0);
    const [click1, setClick1] = useState(null)

    const handleBoardClick = (boardCoord) => {
        const local_history = history.slice(0, currentMoveNum+1);
        const snapshot = local_history[local_history.length - 1];
        if (!click1) {
            // Only continue if valid square, meaning has a piece of the player whose turn it is
            if (piece2Color(snapshot.squares[boardCoord.row][boardCoord.col]) !== moveNum2Color(currentMoveNum)) {
                return
            }
            setClick1(boardCoord)
        } else {
            // Makes deep copy
            const squares = snapshot.squares.map(function(arr) {
                return arr.slice();
            });
            setClick1(null);
            squares[boardCoord.row][boardCoord.col] = squares[click1.row][click1.col];
            squares[click1.row][click1.col] = '';
            local_history.push({
                squares: squares,
                boardCoord1: click1,
                boardCoord2: boardCoord,
            });
            setHistory(local_history);
            setCurrentMoveNum(local_history.length-1);
        }
    }

    const handleListingClick = (moveNum) => {
        setCurrentMoveNum(moveNum);
    }

    const handleReverseClick = (reverseIn) =>{
        console.log('reverseClick')
        setReverse(reverseIn)
    }

    return (
        <div className="game">
            <Board
                squares={history[currentMoveNum].squares}
                onClick={handleBoardClick}
                reverse={reverse}
                highlightedSquares={click1}
            />
            <GameInfo
                history={history} 
                currentMoveNum={currentMoveNum} 
                reverse={reverse} 
                handleListingClick={handleListingClick} 
                handleReverseClick={handleReverseClick}
            />
        </div>
    );
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function piece2Color(piece) {
    if (!piece) {
        return null;
    }
    return piece.toUpperCase() === piece ? 'W' : 'B'
}

function moveNum2Color(moveNum) {
    return ((moveNum % 2) === 0) ? 'W' : 'B';
}

/* 2D functions */

function boardCoord2key(nDims, boardCoord) {
    return (nDims * boardCoord.row) + boardCoord.col
}

function boardCoord2uci(boardCoord) {
    const file = String.fromCharCode('a'.charCodeAt()+boardCoord.col)
    const rank = boardCoord.row+1;
    return `${file}${rank}`;
}