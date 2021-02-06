import React from 'react';
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

    // renderSquare(i) {
    //     let value = this.props.squares[i]
    //     if ((this.props.highlighted) && (this.props.highlighted.includes(i))) {
    //             value = <i>{value}</i>
    //     }
    //     return (
    //         <Square
    //             key={i}
    //             value={value}
    //             onClick={() => this.props.onClick(i)}
    //         />
    //     );
    // }

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

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                turn: '',
                index: '',
                row: '',
                col: '',
            }],
            stepNumber: 0,
            xIsNext: true,
            reverse: false,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber+1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        const turn = this.state.xIsNext ? 'X' : 'O';
        squares[i] = turn;
        const coordinate = calculateRowCol(i);
        this.setState({
            history: history.concat([{
                squares: squares,
                turn: turn,
                index: i,
                row: coordinate.row,
                col: coordinate.col,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            let desc = move ?
                step.turn + ' (' + step.row + ',' + step.col + ')':
                'Game start';
            if (move === this.state.stepNumber) {
                desc = <b>{desc}</b>
            }
            return (
                <ul key={move}>
                    {move}. <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </ul>
            );
        });
        if (this.state.reverse) {
            moves.reverse();
        }

        let status;
        if (winner) {
            status = 'Winner: ' + winner.winner;
        } else if (this.state.stepNumber === 9) {
            status = "Draw";
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                        highlighted={winner ? winner.line : undefined}
                    />
                </div>
                <div className="game-info">
                    <div>
                        {status}&nbsp;
                        <button onClick={() => this.setState({reverse : !this.state.reverse}) }>
                            {this.state.reverse ? '^' : 'v'}
                        </button>
                    </div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
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