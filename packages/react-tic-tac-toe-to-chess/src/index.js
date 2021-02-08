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
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
]

const Square = ({onClick, value, highlighted, colorClass}) => {
    const highlightClass = highlighted ? "square-highlighted" : '';
    // const colorClass = "square-white"
    // const colorClass = "square-white"
    // if (value) {
    //     value = letter2ChessPiece(value);
    // }
    return (
        <button className={`square ${highlightClass} ${colorClass}`} onClick={onClick}>
            {value}
        </button>
    ); 
}

const Board = ({squares, reverse, onClick, clickedSquare}) => {
    const renderSquare = (i, j) => {
        const value = pieceLookup[squares[i][j]];
        let highlighted = false;
        if (clickedSquare) {
            highlighted = i === clickedSquare[0] && j === clickedSquare[1];
        }
        const colorClass = (i % 2 === j % 2) ? "square-black" : "square-white"

        return (
            <Square
                key={rowCol2key(dims, i, j)}
                value={value}
                onClick={() => onClick(i, j)}
                highlighted={highlighted}
                colorClass={colorClass}
            />
        );
    }

    let element = [];

    if (reverse) {
        for (let i=dims-1; i >= 0; i--) {
            element.push(<div key={100+i} className="board-row"></div>)
            for (let j=0; j < dims; j++) {
                element.push(renderSquare(i, j))
            }
        }
    } else {
        for (let i=0; i < dims; i++) {
            element.push(<div key={100+i} className="board-row"></div>)
            for (let j=0; j < dims; j++) {
                element.push(renderSquare(i, j))
            }
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

    const handleClick = (i, j) => {
        setClickedSquare([i, j])
        let local_history = history.slice(0, currentMoveNum+1);
        const snapshot = local_history[local_history.length - 1];
        // Makes deep copy
        const squares = snapshot.squares.map(function(arr) {
            return arr.slice();
        });

        // if (calculateWinner(dims, squares) || squares[i][j]) {
        //     return;
        // }
        squares[i][j] = moveNum2Letter(currentMoveNum);
        local_history.push({
            squares: squares,
            row: i,
            col: j,
        })
        setHistory(local_history)
        setCurrentMoveNum(local_history.length-1)
    }

    const renderGameInfo = () => {
        const listingButtons = history.map((snapshot, moveNum) => {
            let desc = moveNum ?
                moveNum2Letter(moveNum-1) + ' (' + snapshot.row + ',' + snapshot.col + ')':
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
        // if (reverse) {
        //     listingButtons.reverse();
        // }

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
                    onClick={(i, j) => handleClick(i, j)}
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

// function init2DimArray(nDims) {
//     const array2D = []
//     for (let row=0; row < nDims; row++) {
//         array2D.push(Array(nDims).fill(null));
//     }
//     return array2D;
// }