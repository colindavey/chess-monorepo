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

const Board = ({squares, reverse, onClick, clickedSquare}) => {
    const renderSquare = (piece, row, col) => {
        // let highlighted = false;
        // if (clickedSquare) {
        //     highlighted = row === clickedSquare[0] && col === clickedSquare[1];
        // }
        const highlighted = clickedSquare ? (row === clickedSquare[0] && col === clickedSquare[1]) : false;
        const colorClass = (row % 2 === col % 2) ? "square-black" : "square-white"

        return (
            <Square
                key={rowCol2key(dims, row, col)}
                piece={piece}
                onClick={() => onClick(row, col)}
                highlighted={highlighted}
                colorClass={colorClass}
            />
        );
    }

    const pushRow = (row, rowNum, element) => {
        element.push(<div key={100+rowNum} className="board-row"></div>)
        row.forEach((col, colNum) => 
            element.push(renderSquare(pieceLookup[col], rowNum, colNum)))
        return element;
    }

    let element = [];
    // Really need the old school loops - reversing causes problems, as does auto
    // generation of index with forEach
    if (reverse) {
        for (let row=0; row < dims; row++) {
            element = pushRow(squares[row], row, element)
        }
    } else {
        for (let row=dims-1; row >= 0; row--) {
            element = pushRow(squares[row], row, element)
        }
    }

    return (
        <div>
            {element}
        </div>
    );
}

const Game  = () => {
    const [reverse, setReverse] = useState(false);
    const [history, setHistory] = useState(
        [{
            // squares: init2DimArray(dims),
            squares: initPosition,
            row: '',
            col: '',
        }])
    const [currentMoveNum, setCurrentMoveNum] = useState(0);
    const [clickedSquare, setClickedSquare] = useState(null)

    const handleClick = (row, col) => {
        setClickedSquare([row, col])
        const local_history = history.slice(0, currentMoveNum+1);
        const snapshot = local_history[local_history.length - 1];
        // Makes deep copy
        const squares = snapshot.squares.map(function(arr) {
            return arr.slice();
        });

        // if (calculateWinner(dims, squares) || squares[row][col]) {
        //     return;
        // }
        squares[row][col] = moveNum2Letter(currentMoveNum);
        local_history.push({
            squares: squares,
            row: row,
            col: col,
        })
        setHistory(local_history)
        setCurrentMoveNum(local_history.length-1)
    }

    const renderGameInfo = () => {
        const listingButtons = history.map((snapshot, moveNum) => {
            let desc = moveNum ?
                `${moveNum2Letter(moveNum-1)} ${rowCol2uci(snapshot.row, snapshot.col)}`:
                'Game start';
            if (moveNum === currentMoveNum) {
                desc = <b>{desc}</b>
            }
            return (
                <ul key={moveNum}>
                    {moveNum}. <button onClick={() => setCurrentMoveNum(moveNum)}>{desc}</button>
                </ul>
            );
        });

        // const winner = calculateWinner(dims, history[currentMoveNum].squares);
        // let status;
        // if (winner) {
        //     status = 'Winner: ' + winner.winner;
        // } else if (currentMoveNum === dims*dims) {
        //     status = "Draw";
        // } else {
        //     status = 'Next player: ' + moveNum2Letter(currentMoveNum);
        // }
        let status;
        status = 'Next player: ' + moveNum2Letter(currentMoveNum);

        return (
            <div>
                <div>
                    {status}&nbsp;
                    <button onClick={() => setReverse(!reverse)}>
                        {reverse ? '^' : 'v'}
                    </button>
                </div>
                <ol>{listingButtons}</ol>
            </div>
        )
    }

    return (
        <div className="game">
            <div className="game-board">
                <Board
                    squares={history[currentMoveNum].squares}
                    onClick={(row, col) => handleClick(row, col)}
                    reverse={reverse}
                    clickedSquare={clickedSquare}
                />
            </div>
            <div className="game-info">
                {renderGameInfo()}
            </div>
        </div>
    );
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function moveNum2Letter(moveNum) {
    const xIsNext = ((moveNum % 2) === 0)
    // return xIsNext ? 'X' : 'O';
    // return xIsNext ? WHITE_KING : BLACK_KING;
    return xIsNext ? 'K' : 'k';
}

/* 2D functions */

function rowCol2key(nDims, row, col) {
    return (nDims * row) + col
}

function rowCol2uci(row, col) {
    const file = String.fromCharCode('a'.charCodeAt()+col)
    const rank = row+1;
    return `${file}${rank}`;
}