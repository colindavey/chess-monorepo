import React, { useState } from 'react'
import GameBoard from './gameBoard'
import ChessListingGrid from './chessListingGrid'
import * as chessApi from './chessApi.js'
import * as chessUtils from './chessUtils.js'

const ChessListingGrid = ({
    moves,
    currentMoveNum,
    handleClick,
    setupUrl,
    fen,
    initTurn,
    initFullMoveNumber
}) => {
    const numMoves = moves.length
    // allow the top left cell to be empty if Black has first move
    if (initTurn === 'B') {
        moves = ['', ...moves]
    }
    // Create an array of rows, where each row has a white move and a black move.
    // The first move is empty if init turn is black. Last col of last row can be
    // empty if last move made was white's.
    const tableMoves = []
    for (let i = 0; i < moves.length; i += 2) {
        // if initial move was black's, then adjust
        const leftMoveNum = initTurn === 'W' ? i : i - 1
        const rightMoveNum = leftMoveNum + 1
        tableMoves.push([
            moves[i] ? { move: moves[i], moveNum: leftMoveNum } : '',
            moves[i + 1] ? { move: moves[i + 1], moveNum: rightMoveNum } : ''
        ])
    }

    const renderCol = (row, rowIndex) => {
        return row.map((col, colIndex) => {
            const key = `${rowIndex},${colIndex}`
            /* eslint-disable */
            const move =
                col.moveNum + 1 === currentMoveNum
                    ?
                        <b>{col.move}</b> 
                    :
                        col.move
            /* eslint-enable */
            /* eslint-disable */
            return col
                ?
                    <div
                        key={key}
                        className='grid-cell grid-cell-button'
                        onClick={() => handleClick(col.moveNum+1)}
                    >
                        {move}
                    </div>
                :
                    <div key={key} className='grid-cell'/>
            /* eslint-enable */
        })
    }

    const listing = tableMoves.map((row, index) => {
        const newCol = renderCol(row, index)
        return (
            <div key={index} className='grid-wrapper'>
                <div className='grid-cell'>{index + initFullMoveNumber}.</div>
                {newCol}
            </div>
        )
    })
    return (
        <div className='game-info'>
            <div className='scroll'>{listing}</div>
            <button onClick={() => handleClick(0)}>|&lt;</button>
            <button
                onClick={() => handleClick(Math.max(currentMoveNum - 1, 0))}
            >
                &lt;
            </button>
            <button
                onClick={() =>
                    handleClick(Math.min(currentMoveNum + 1, numMoves))
                }
            >
                &gt;
            </button>
            <button onClick={() => handleClick(numMoves)}>&gt;|</button>
            <br />
            <a href={`${setupUrl}?fen=${encodeURIComponent(fen)}`}>
                <button>Setup</button>
            </a>
        </div>
    )
}

const GameView = ({
    position,
    currentMoveNum,
    legalMoves,
    moves,
    status,
    handleMove,
    handleListingClick,
    setupUrl,
    fen,
    over,
    initTurn,
    initFullMoveNumber
}) => {
    return (
        <div className='game'>
            <GameBoard
                position={position}
                turn={chessUtils.moveNum2Color(currentMoveNum, initTurn)}
                onMove={handleMove}
                legalMoves={legalMoves}
                over={over}
                status={status}
            />
            <ChessListingGrid
                moves={moves}
                currentMoveNum={currentMoveNum}
                handleClick={handleListingClick}
                setupUrl={setupUrl}
                fen={fen}
                initTurn={initTurn}
                initFullMoveNumber={initFullMoveNumber}
            />
        </div>
    )
}

const Game = ({ setupUrl }) => {
    const urlSearchParams = new URLSearchParams(window.location.search)
    const params = Object.fromEntries(urlSearchParams.entries())
    const initFen = params.fen
    const initGameState = chessApi.initGame(initFen)
    let tmpFullMoveNumber = 1
    let tmpTurn = 'W'
    if (initFen) {
        const { fullMoveNumber: fenFullMoveNumber, turn: fenTurn } =
            chessApi.fen2Setup(initFen)
        tmpFullMoveNumber = parseInt(fenFullMoveNumber)
        tmpTurn = fenTurn
    }
    const initFullMoveNumber = tmpFullMoveNumber
    const initTurn = tmpTurn

    const [moves, setMoves] = useState([])
    const [currentMoveNum, setCurrentMoveNum] = useState(0)
    const [position, setPosition] = useState(initGameState.position)
    const [legalMoves, setLegalMoves] = useState(initGameState.legalMoves)
    const [status, setStatus] = useState(initGameState.status)
    const [over, setOver] = useState(initGameState.over)
    const [fen, setFen] = useState(initGameState.fen)

    // Should only get here if legal move has been made
    const handleMove = (click1, click2, promotion = '') => {
        const localMoves = moves.slice(0, currentMoveNum)
        const chessApiState = chessApi.moveAdd(
            localMoves,
            `${chessUtils.boardCoord2uci(click1)}${chessUtils.boardCoord2uci(
                click2
            )}${promotion}`,
            initFen
        )
        setMoves(chessApiState.moves)
        updateState(chessApiState, localMoves.length + 1)
    }

    const handleListingClick = moveNum => {
        const chessApiState = chessApi.moveTo(moves.slice(0, moveNum), initFen)
        // setMoves(chessApiState.moves)
        updateState(chessApiState, moveNum)
    }

    const updateState = (
        { position, legalMoves, status, fen, over },
        moveNum
    ) => {
        setPosition(position)
        setLegalMoves(legalMoves)
        setCurrentMoveNum(moveNum)
        setStatus(status)
        setOver(over)
        setFen(fen)
    }

    return (
        <GameView
            position={position}
            legalMoves={legalMoves}
            moves={moves}
            status={status}
            currentMoveNum={currentMoveNum}
            handleMove={handleMove}
            handleListingClick={handleListingClick}
            setupUrl={setupUrl}
            fen={fen}
            over={over}
            initTurn={initTurn}
            initFullMoveNumber={initFullMoveNumber}
        />
    )
}

export default Game
