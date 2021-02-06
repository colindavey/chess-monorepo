import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const Square = ({onClick, value, highlighted}) => {
    const highlightClass = highlighted ? "square-highlighted" : '';
    return (
        <button className={"square " + highlightClass} onClick={onClick}>
            {value}
        </button>
    ); 
}

const Board = ({squares, onClick}) => {
    const renderSquare = (i) => {
        const value = squares[i]
        const winner = calculateWinner(squares);
        const highlighted = winner && (winner.line.includes(i))

        return (
            <Square
                key={i}
                value={value}
                onClick={() => onClick(i)}
                highlighted={highlighted}
            />
        );
    }

    let element = [];
    for (let i=0; i < 3; i++) {
        element.push(<div key={100+i} className="board-row"></div>)
        for (let j=0; j < 3; j++) {
            element.push(renderSquare((3*i) + j))
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
            squares: Array(9).fill(null),
            row: '',
            col: '',
        }])
    const [currentMoveNum, setCurrentMoveNum] = useState(0);

    const handleClick = i => {
        let local_history = history.slice(0, currentMoveNum+1);
        const snapshot = local_history[local_history.length - 1];
        const squares = snapshot.squares.slice();

        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = moveNum2Letter(currentMoveNum);
        const coordinate = calculateRowCol(i);
        local_history.push({
            squares: squares,
            row: coordinate.row,
            col: coordinate.col,
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

        const winner = calculateWinner(history[currentMoveNum].squares);
        let status;
        if (winner) {
            status = 'Winner: ' + winner.winner;
        } else if (currentMoveNum === 9) {
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
                    onClick={(i) => handleClick(i)}
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

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {winner : squares[a], line : lines[i]};
        }
    }
    return null;
}

function calculateRowCol(num) {
    const row = Math.floor(num / 3) + 1;
    const col = (num % 3) + 1;
    return {row : row, col : col};
}

function moveNum2Letter(moveNum) {
    const xIsNext = ((moveNum % 2) === 0)
    return xIsNext ? 'X' : 'O';
}
