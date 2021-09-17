import React, { useState, useEffect } from 'react'
import DumbBoard from './dumbBoard'
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

const GameBoard = ({ position, turn, onMove, legalMoves, over, status }) => {
    const [click1, setClick1] = useState(null)
    const [click2, setClick2] = useState(null)
    const [legalDests, setLegalDests] = useState([])
    const [highlightList, setHighlightList] = useState([])
    const [showPromotion, setShowPromotion] = useState(false)
    const [clientX, setClientX] = useState(0)
    const [clientY, setClientY] = useState(0)

    // If the position has changed, then highlighting (from click1) should be turned off
    useEffect(() => clearClicks(), [position])

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
                message={status}
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

export default GameBoard
