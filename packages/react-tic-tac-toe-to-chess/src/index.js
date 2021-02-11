import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

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

// const Board = ({squares, currentMoveNum, reverse, onMove}) => {
const Board = ({squares, currentMoveNum, onMove}) => {
    const [reverse, setReverse] = useState(false);
    const [click1, setClick1] = useState(null)

    const renderSquare = (piece, boardCoord) => {
        const highlighted = click1 ? (boardCoord.row === click1.row && boardCoord.col === click1.col) : false;
        const colorClass = (boardCoord.row % 2 === boardCoord.col % 2) ? "square-black" : "square-white"

        return (
            <Square
                key={boardCoord2key(DIMS, boardCoord)}
                piece={piece}
                onClick={() => onClick(boardCoord)}
                highlighted={highlighted}
                colorClass={colorClass}
            />
        );
    }

    const onClick = (boardCoord) => {
        if (!click1) {
            if (piece2Color(squares[boardCoord.row][boardCoord.col]) !== moveNum2Color(currentMoveNum)) {
                return
            }
            setClick1(boardCoord)
        } else {
            setClick1(null)
            onMove(click1, boardCoord)
        }
    }

    const renderRow = (row, rowNum, boardElement) => {
        const rowElement =  row.map((col, colNum) => renderSquare(pieceLookup[col], {row: rowNum, col: colNum}))
        return (
            <div key={100+rowNum} className="board-row">
                {rowElement}
            </div>
        )
    }

    const renderBoard = () => {
        // Really need the old school loops - reversing causes problems, as does auto
        // generation of index with forEach
        const [startInd, endInd, indStep] = reverse ? [0, DIMS, 1] : [DIMS-1, -1, -1]
        let boardElement = [];
        for (let row=startInd; row !== endInd; row += indStep) {
            boardElement.push(renderRow(squares[row], row))
        }
        // if (reverse) {
        //     for (let row=0; row < DIMS; row++) {
        //         boardElement.push(renderRow(squares[row], row))
        //     }
        // } else {
        //     for (let row=DIMS-1; row >= 0; row--) {
        //         boardElement.push(renderRow(squares[row], row))
        //     }
        // }
        return boardElement;
    }

    const handleReverseClick = (reverseIn) => {
        setReverse(reverseIn)
        console.log('reverse')
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
                    <div key={index} className="grid-cell" onClick={() => handleClick(col.index+1)}>{move}</div> 
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
                <div className="grid-cell" onClick={() => handleClick(0)}>Starting position</div>
            </div>
            {listing}
        </div>
    )
}

const GameInfo = ({history, currentMoveNum, reverse, handleListingClick, handleReverseClick}) => {
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

    const moves = history.slice(1).map(snapshot => `${boardCoord2uci(snapshot.boardCoord1)}${boardCoord2uci(snapshot.boardCoord2)}`)

    return (
        <div className="game-info">
            {status}&nbsp;
            <ChessListingGrid
                moves={moves} 
                currentMoveNum={currentMoveNum} 
                handleClick={handleListingClick} 
            />
        </div>
    )
}

const Game  = () => {
    const [history, setHistory] = useState(
        [{
            // squares: init2DimArray(DIMS),
            squares: initPosition,
            boardCoord1: null,
            boardCoord2: null,
        }])
    const [currentMoveNum, setCurrentMoveNum] = useState(0);

    // Should only get here if legal move has been made
    const handleMove = (click1, click2) => {
        const local_history = history.slice(0, currentMoveNum+1);
        const snapshot = local_history[local_history.length - 1];
        // Makes deep copy
        const squares = snapshot.squares.map(function(arr) {
            return arr.slice();
        });
        squares[click2.row][click2.col] = squares[click1.row][click1.col];
        squares[click1.row][click1.col] = '';
        local_history.push({
            squares: squares,
            boardCoord1: click1,
            boardCoord2: click2,
        });
        setHistory(local_history);
        setCurrentMoveNum(local_history.length-1);
    }

    const handleListingClick = (moveNum) => {
        setCurrentMoveNum(moveNum);
    }

    return (
        <div className="game">
            <Board
                squares={history[currentMoveNum].squares}
                currentMoveNum={currentMoveNum}
                onMove={handleMove}
            />
            <GameInfo
                history={history} 
                currentMoveNum={currentMoveNum} 
                handleListingClick={handleListingClick} 
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