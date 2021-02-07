import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const dims = 3;
// const dims = 5;

const WHITE_KING = "\u2654";
// const WHITE_QUEEN = "\u2655";
// const WHITE_ROOK = "\u2656";
// const WHITE_BISHOP = "\u2657";
// const WHITE_KNIGHT = "\u2658";
// const WHITE_PAWN = "\u2659";
const BLACK_KING = "\u265A";
// const BLACK_QUEEN = "\u265B";
// const BLACK_ROOK = "\u265C";
// const BLACK_BISHOP = "\u265D";
// const BLACK_KNIGHT = "\u265E";
// const BLACK_PAWN = "\u265F";

const Square = ({onClick, value, highlighted}) => {
    const highlightClass = highlighted ? "square-highlighted" : '';
    // if (value) {
    //     value = letter2ChessPiece(value);
    // }
    return (
        <button className={"square " + highlightClass} onClick={onClick}>
            {value}
        </button>
    ); 
}

const Board = ({squares, onClick}) => {
    const renderSquare = (i, j) => {
        const value = squares[i][j]
        const winner = calculateWinner(dims, squares);
        // line is one of 
        //   cN (or other number) - column N
        //   rN (or other number) - row N
        //   diagUp upper diagonal
        //   diagDown lower diagonal
        let highlighted;
        if (winner) {
            if (winner.line[0] === 'c' && parseInt(winner.line[1]) === j) {
                highlighted = true;
            } else if (winner.line[0] === 'r' && parseInt(winner.line[1]) === i) {
                highlighted = true;
            } else if (winner.line === 'diagDown' && i === j) {
                highlighted = true;
            } else if (winner.line === 'diagUp' && i === (dims-1) - 1) {
                highlighted = true;
            }
        }

        return (
            <Square
                key={rowCol2key(dims, i, j)}
                value={value}
                onClick={() => onClick(i, j)}
                highlighted={highlighted}
            />
        );
    }

    let element = [];
    for (let i=dims-1; i >= 0; i--) {
        element.push(<div key={100+i} className="board-row"></div>)
        for (let j=0; j < dims; j++) {
            element.push(renderSquare(i, j))
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
            squares: init2DimArray(dims),
            row: '',
            col: '',
        }])
    const [currentMoveNum, setCurrentMoveNum] = useState(0);

    const handleClick = (i, j) => {
        let local_history = history.slice(0, currentMoveNum+1);
        const snapshot = local_history[local_history.length - 1];
        // Makes deep copy
        const squares = snapshot.squares.map(function(arr) {
            return arr.slice();
        });

        if (calculateWinner(dims, squares) || squares[i][j]) {
            return;
        }
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
        if (reverse) {
            listingButtons.reverse();
        }

        const winner = calculateWinner(dims, history[currentMoveNum].squares);
        let status;
        if (winner) {
            status = 'Winner: ' + winner.winner;
        } else if (currentMoveNum === dims*dims) {
            status = "Draw";
        } else {
            status = 'Next player: ' + moveNum2Letter(currentMoveNum);
        }

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
    return xIsNext ? WHITE_KING : BLACK_KING;
}

/* 2D functions */

// line is one of 
//   cN (or other number) - column N
//   rN (or other number) - row N
//   diagUp upper diagonal
//   diagDown lower diagonal
function calculateWinner(nDims, squares) {
    const vectors = [];
    const lines = [];
    const diagVectorAscending = []
    const diagVectorDescending = []
    // Simultaneously build up all the row and column vectors as well as
    // each diagonal vector
    for (let ind=0; ind < nDims; ind++) {
        const rowVector = squares[ind];
        const colVector = squares.reduce(
            (accum, vecIn) => {
                accum.push(vecIn[ind])
                return accum;
            },
            []
        );
        vectors.push(rowVector);
        lines.push(`r${ind}`)
        vectors.push(colVector);
        lines.push(`c${ind}`)
        diagVectorAscending.push(squares[ind][ind])
        diagVectorDescending.push(squares[ind][(nDims-1)-ind])
    }
    vectors.push(diagVectorDescending)
    lines.push('diagUp')
    vectors.push(diagVectorAscending)
    lines.push('diagDown')
    // Run through all the vectors accumulated above, and see if we have a winner
    for (let i = 0; i < vectors.length; i++) {
        const vector = vectors[i]
        const val = vector[0]
        if (val) {
            // Reduce results in true if all elements in the vector are the same
            const haveWinner = vector.reduce(
                (accum, valIn) => accum && (valIn === val)
            )
            if (haveWinner) {
                return {winner : val, line : lines[i]};
            }
        }
    }
    return null;
}

function rowCol2key(nDims, row, col) {
    return (nDims * row) + col
}

function init2DimArray(nDims) {
    const array2D = []
    for (let row=0; row < nDims; row++) {
        array2D.push(Array(nDims).fill(null));
    }
    return array2D;
}