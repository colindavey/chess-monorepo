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
    const [history, setHistory] = useState(
        [{
            squares: Array(9).fill(null),
            turn: '',
            index: '',
            row: '',
            col: '',
        }])
    const [stepNumber, setStepNumber] = useState(0);
    const [xIsNext, setXIsNext] = useState(true);
    const [reverse, setReverse] = useState(false);
    const [winner, setWinner] = useState(null);
    const [squares, setSquares] = useState(history[0].squares);

    const handleClick = i => {
        const local_history = history.slice(0, stepNumber+1);
        const snapshot = local_history[local_history.length - 1];
        const squares = snapshot.squares.slice();
        const winner = calculateWinner(snapshot.squares);
        setWinner(winner)
        setSquares(squares)

        if (winner || squares[i]) {
            return;
        }
        const turn = xIsNext ? 'X' : 'O';
        squares[i] = turn;
        const coordinate = calculateRowCol(i);
        setHistory(local_history.concat([{
            squares: squares,
            turn: turn,
            index: i,
            row: coordinate.row,
            col: coordinate.col,
        }]))
        setStepNumber(local_history.length)
        setXIsNext(!xIsNext)
    }

    const jumpTo = step => {
        setStepNumber(step)
        setXIsNext((step % 2) === 0)
        setSquares(history[step].squares.slice())
        // const winner = calculateWinner(snapshot.squares);
        // setWinner(winner)
    }

    const renderGameInfo = () => {
        const moves = history.map((step, move) => {
            let desc = move ?
                step.turn + ' (' + step.row + ',' + step.col + ')':
                'Game start';
            if (move === stepNumber) {
                desc = <b>{desc}</b>
            }
            return (
                <ul key={move}>
                    {move}. <button onClick={() => jumpTo(move)}>{desc}</button>
                </ul>
            );
        });
        if (reverse) {
            moves.reverse();
        }

        let status;
        const winner = calculateWinner(squares);
        // setWinner(winner)
        if (winner) {
            status = 'Winner: ' + winner.winner;
        } else if (stepNumber === 9) {
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
                <ol>{moves}</ol>
            </div>
        )
    }

    return (
        <div className="game">
            <div className="game-board">
                <Board
                    // squares={current.squares}
                    squares={squares.slice()}
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