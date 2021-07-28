import React, { useState } from 'react'
import DumbBoard from './dumbBoard'
import * as chessApi from './chessApi.js'
import * as chessUtils from './chessUtils.js'

const SmartBoard = ({ position, turn, onMove, legalMoves }) => {
    const [click1, setClick1] = useState(null)
    const [legalDests, setLegalDests] = useState([])
    const [highlightList, setHighlightList] = useState([])

    const handleClick = boardCoord => {
        if (
            chessUtils.piece2Color(position[boardCoord.row][boardCoord.col]) ===
            turn
        ) {
            setClick1(boardCoord)
            const legalDests = chessUtils.getLegalDestsFrom(
                boardCoord,
                legalMoves
            )
            setLegalDests(legalDests)
            const highlightList = legalDests
            highlightList.push(chessUtils.boardCoord2uci(boardCoord))
            setHighlightList(highlightList)
        } else {
            if (!click1) {
                return
            }
            if (legalDests.includes(chessUtils.boardCoord2uci(boardCoord))) {
                onMove(click1, boardCoord)
            }
            setClick1(null)
            setHighlightList([])
        }
    }

    return (
        <DumbBoard
            position={position}
            highlightList={highlightList}
            handleClick={handleClick}
        />
    )
}

const ChessListingGrid = ({ moves, currentMoveNum, handleClick }) => {
    const tableMoves = []
    for (let i = 0; i < moves.length; i += 2) {
        tableMoves.push([
            { move: moves[i], index: i },
            moves[i + 1] ? { move: moves[i + 1], index: i + 1 } : ''
        ])
    }

    const renderCol = (row, rowIndex) => {
        return row.map((col, colIndex) => {
            const index = `${rowIndex},${colIndex}`
            const move =
                col.index + 1 === currentMoveNum ? <b>{col.move}</b> : col.move
            /* eslint-disable */
            return col
                ?
                    <div
                        key={index}
                        className='grid-cell grid-cell-button'
                        onClick={() => handleClick(col.index+1)}
                    >
                        {move}
                    </div>
                :
                    <div key={index} className='grid-cell'/>
            /* eslint-enable */
        })
    }

    const listing = tableMoves.map((row, index) => {
        const newCol = renderCol(row, index)
        return (
            <div key={index} className='grid-wrapper'>
                <div className='grid-cell'>{index + 1}.</div>
                {newCol}
            </div>
        )
    })
    return (
        <div>
            <div className='scroll'>{listing}</div>
            <button onClick={() => handleClick(0)}>|&lt;</button>
            <button
                onClick={() => handleClick(Math.max(currentMoveNum - 1, 0))}
            >
                &lt;
            </button>
            <button
                onClick={() =>
                    handleClick(Math.min(currentMoveNum + 1, moves.length))
                }
            >
                &gt;
            </button>
            <button onClick={() => handleClick(moves.length)}>&gt;|</button>
        </div>
    )
}

const GameInfo = ({ moves, status, currentMoveNum, handleListingClick }) => {
    return (
        <div className='game-info'>
            {status}
            <ChessListingGrid
                moves={moves}
                currentMoveNum={currentMoveNum}
                handleClick={handleListingClick}
            />
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
    handleListingClick
}) => {
    return (
        <div className='game'>
            <SmartBoard
                position={position}
                turn={chessUtils.moveNum2Color(currentMoveNum)}
                onMove={handleMove}
                legalMoves={legalMoves}
            />
            <GameInfo
                moves={moves}
                status={status}
                currentMoveNum={currentMoveNum}
                handleListingClick={handleListingClick}
            />
        </div>
    )
}

const Game = () => {
    // const initGameState = chessApi.initGameState
    const fen = 'k1K5/8/6P1/8/8/8/8/8 w - - 0 1'
    // const fen = null
    const initGameState = chessApi.initGame(fen)
    // const initGameState = chessApi.fen2Game('k1K5/8/6P1/8/8/8/8/8 w - - 0 1')
    const [moves, setMoves] = useState([])
    const [currentMoveNum, setCurrentMoveNum] = useState(0)
    const [position, setPosition] = useState(initGameState.position)
    const [legalMoves, setLegalMoves] = useState(initGameState.legalMoves)
    const [status, setStatus] = useState(initGameState.status)

    // Should only get here if legal move has been made
    const handleMove = (click1, click2) => {
        console.log('handleMove')
        const localMoves = moves.slice(0, currentMoveNum)
        console.log(position)
        const chessApiState = chessApi.moveAdd(
            localMoves,
            `${chessUtils.boardCoord2uci(click1)}${chessUtils.boardCoord2uci(
                click2
            )}`,
            fen
        )
        console.log(chessApiState)
        setMoves(chessApiState.moves)
        updateState(chessApiState, localMoves.length + 1)
    }

    const handleListingClick = moveNum => {
        const chessApiState = chessApi.moveTo(moves.slice(0, moveNum), fen)
        // setMoves(chessApiState.moves)
        updateState(chessApiState, moveNum)
    }

    const updateState = ({ position, legalMoves, status }, moveNum) => {
        console.log('updateState', position)
        // setGameState(chessApiState);
        setPosition(position)
        setLegalMoves(legalMoves)
        setCurrentMoveNum(moveNum)
        setStatus(status)
    }

    return (
        <GameView
            position={position}
            turn={chessUtils.moveNum2Color(currentMoveNum)}
            legalMoves={legalMoves}
            moves={moves}
            status={status}
            currentMoveNum={currentMoveNum}
            handleMove={handleMove}
            handleListingClick={handleListingClick}
        />
    )
}

export default Game
