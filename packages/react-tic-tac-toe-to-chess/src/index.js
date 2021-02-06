import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const Square = ({onClick, value}) => (
    <button className="square" onClick={onClick}>
        {value}
    </button>
);

const Board = ({squares, highlighted, onClick}) => {
    const renderSquare = (i) => {
        let value = squares[i]
        if ((highlighted) && (highlighted.includes(i))) {
                value = <i>{value}</i>
        }
        return (
            <Square
                key={i}
                value={value}
                onClick={() => onClick(i)}
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
            turn: '',
            row: '',
            col: '',
        }])
    let moveNum = 0;
    const [currentMoveNum, setCurrentMoveNum] = useState(moveNum);
    const [xIsNext, setXIsNext] = useState(true);
    const [winner, setWinner] = useState(null);
    const [squares, setSquares] = useState(history[moveNum].squares);

    const handleClick = i => {
        let local_history = history.slice(0, currentMoveNum+1);
        const snapshot = local_history[local_history.length - 1];
        const squares = snapshot.squares.slice();

        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        const turn = xIsNext ? 'X' : 'O';
        squares[i] = turn;
        const coordinate = calculateRowCol(i);
        local_history.push({
            squares: squares,
            turn: turn,
            row: coordinate.row,
            col: coordinate.col,
        })
        setHistory(local_history)

        const moveNum = local_history.length-1
        setCurrentMoveNum(moveNum)
        setXIsNext((moveNum % 2) === 0)
        setSquares(squares)
        const winner = calculateWinner(squares);
        setWinner(winner)
    }

    const jumpTo = moveNum => {
        setCurrentMoveNum(moveNum)
        setXIsNext((moveNum % 2) === 0)
        const squares = history[moveNum].squares
        setSquares(squares)
        const winner = calculateWinner(squares);
        setWinner(winner)
    }

    const renderGameInfo = () => {
        const listingButtons = history.map((snapshot, moveNum) => {
            let desc = moveNum ?
                snapshot.turn + ' (' + snapshot.row + ',' + snapshot.col + ')':
                'Game start';
            if (moveNum === currentMoveNum) {
                desc = <b>{desc}</b>
            }
            return (
                <ul key={moveNum}>
                    {moveNum}. <button onClick={() => jumpTo(moveNum)}>{desc}</button>
                </ul>
            );
        });
        if (reverse) {
            listingButtons.reverse();
        }

        let status;
        if (winner) {
            status = 'Winner: ' + winner.winner;
        } else if (currentMoveNum === 9) {
            status = "Draw";
        } else {
            status = 'Next player: ' + (xIsNext ? 'X' : 'O');
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
                    squares={squares}
                    onClick={(i) => handleClick(i)}
                    highlighted={winner ? winner.line : undefined}
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