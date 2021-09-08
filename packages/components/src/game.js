import React, { useState } from 'react'
import DumbBoard from './dumbBoard'
import * as chessApi from './chessApi.js'
import * as chessUtils from './chessUtils.js'

const modalContainerStyle = {
    zIndex: '3',
    position: 'fixed',
    left: '0',
    top: '0',
    width: '100%',
    height: '100%',
    overflow: 'auto',
    backgroundColor: 'rgba(0,0,0,0.4)'
}

const promotionStyle = {
    position: 'fixed',
    padding: '5px',
    background: 'rgba(0.0, 0.0, 0.0, 0.9)'
}

const ModalPromotion = ({ turn, promoteCallback, clientX, clientY }) => {
    const promotionStyleTmp = JSON.parse(JSON.stringify(promotionStyle))
    promotionStyleTmp.left = clientX
    promotionStyleTmp.top = clientY
    const qSym =
        turn === 'B' ? chessUtils.pieceLookup.q : chessUtils.pieceLookup.Q
    const rSym =
        turn === 'B' ? chessUtils.pieceLookup.r : chessUtils.pieceLookup.R
    const bSym =
        turn === 'B' ? chessUtils.pieceLookup.b : chessUtils.pieceLookup.B
    const nSym =
        turn === 'B' ? chessUtils.pieceLookup.n : chessUtils.pieceLookup.N
    return (
        <div style={modalContainerStyle}>
            <div style={promotionStyleTmp}>
                <button onClick={() => promoteCallback('Q')}>{qSym}</button>
                <button onClick={() => promoteCallback('R')}>{rSym}</button>
                <button onClick={() => promoteCallback('B')}>{bSym}</button>
                <button onClick={() => promoteCallback('N')}>{nSym}</button>
                <button onClick={() => promoteCallback('')}>Cancel</button>
            </div>
        </div>
    )
}

const SmartBoard = ({ position, turn, onMove, legalMoves, over }) => {
    const [click1, setClick1] = useState(null)
    const [click2, setClick2] = useState(null)
    const [legalDests, setLegalDests] = useState([])
    const [highlightList, setHighlightList] = useState([])
    const [showPromotion, setShowPromotion] = useState(false)
    const [clientX, setClientX] = useState(0)
    const [clientY, setClientY] = useState(0)

    const handleClick = ({ clientX, clientY }, boardCoord) => {
        if (!over) {
            if (
                chessUtils.piece2Color(
                    position[boardCoord.row][boardCoord.col]
                ) === turn
            ) {
                setClick1(boardCoord)
                const legalDests = chessUtils.getLegalDestsFrom(
                    boardCoord,
                    legalMoves
                )
                setLegalDests(legalDests)
                setHighlightList([
                    ...legalDests,
                    chessUtils.boardCoord2uci(boardCoord)
                ])
            } else {
                if (!click1) {
                    return
                }
                if (
                    legalDests.includes(chessUtils.boardCoord2uci(boardCoord))
                ) {
                    // Deal with promotion
                    if (
                        (position[click1.row][click1.col] === 'P' &&
                            boardCoord.row === 7) ||
                        (position[click1.row][click1.col] === 'p' &&
                            boardCoord.row === 0)
                    ) {
                        setShowPromotion(true)
                        setClick2(boardCoord)
                        setClientX(clientX)
                        setClientY(clientY)
                        return
                    }
                    onMove(click1, boardCoord)
                }
                clearClicks()
            }
        }
    }

    const promotionCallback = value => {
        if (value) {
            onMove(click1, click2, value)
        }
        setShowPromotion(false)
        clearClicks()
    }

    const clearClicks = () => {
        setClick1(null)
        setClick2(null)
        setHighlightList([])
    }

    return (
        <div>
            <DumbBoard
                position={position}
                highlightList={highlightList}
                handleClick={handleClick}
            />
            {showPromotion && (
                <ModalPromotion
                    turn={turn}
                    promoteCallback={promotionCallback}
                    clientX={clientX}
                    clientY={clientY}
                />
            )}
        </div>
    )
}

const ChessListingGrid = ({
    moves,
    currentMoveNum,
    handleClick,
    setupUrl,
    fen
}) => {
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
            <a href={`${setupUrl}?fen=${encodeURIComponent(fen)}`}>
                <button>Setup</button>
            </a>
        </div>
    )
}

const GameInfo = ({
    moves,
    status,
    currentMoveNum,
    handleListingClick,
    setupUrl,
    fen
}) => {
    return (
        <div className='game-info'>
            {status}
            <ChessListingGrid
                moves={moves}
                currentMoveNum={currentMoveNum}
                handleClick={handleListingClick}
                setupUrl={setupUrl}
                fen={fen}
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
    handleListingClick,
    setupUrl,
    fen,
    over
}) => {
    return (
        <div className='game'>
            <SmartBoard
                position={position}
                turn={chessUtils.moveNum2Color(currentMoveNum)}
                onMove={handleMove}
                legalMoves={legalMoves}
                over={over}
            />
            <GameInfo
                moves={moves}
                status={status}
                currentMoveNum={currentMoveNum}
                handleListingClick={handleListingClick}
                setupUrl={setupUrl}
                fen={fen}
            />
        </div>
    )
}

const Game = ({ setupUrl }) => {
    // const initGameState = chessApi.initGameState
    // const fen = 'k1K5/8/6P1/8/8/8/8/8 w - - 0 1'
    // const fen = null
    // const urlSearchParams = new URLSearchParams(
    //     window.location.search.split('?')[0]
    // )
    const urlSearchParams = new URLSearchParams(window.location.search)
    const params = Object.fromEntries(urlSearchParams.entries())
    const initFen = params.fen
    if (initFen) {
        chessApi.fen2Setup(initFen)
    }

    const initGameState = chessApi.initGame(initFen)
    // const initGameState = chessApi.fen2Game('k1K5/8/6P1/8/8/8/8/8 w - - 0 1')

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
        // setGameState(chessApiState);
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
            turn={chessUtils.moveNum2Color(currentMoveNum)}
            legalMoves={legalMoves}
            moves={moves}
            status={status}
            currentMoveNum={currentMoveNum}
            handleMove={handleMove}
            handleListingClick={handleListingClick}
            setupUrl={setupUrl}
            fen={fen}
            over={over}
        />
    )
}

export default Game
