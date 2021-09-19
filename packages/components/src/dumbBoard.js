import React, { useState } from 'react'
import * as chessUtils from './chessUtils.js'
import { DIMS } from './chessUtils.js'

const Square = ({ onClick, piece, highlighted, colorClass }) => {
    const highlightClass = highlighted ? 'square-highlighted' : ''
    return (
        <button className={`square ${highlightClass} ${colorClass}`} onClick={onClick}>
            {piece}
        </button>
    )
}

const DumbBoard = ({ position, highlightList = [], handleClick, message = '' }) => {
    const [reverse, setReverse] = useState(false)

    const renderSquare = (piece, boardCoord) => {
        const highlighted = highlightList.includes(chessUtils.boardCoord2uci(boardCoord))
        const colorClass =
            boardCoord.row % 2 === boardCoord.col % 2 ? 'square-black' : 'square-white'

        return (
            <Square
                key={chessUtils.boardCoord2key(DIMS, boardCoord)}
                piece={piece}
                onClick={e => handleClick(e, boardCoord)}
                highlighted={highlighted}
                colorClass={colorClass}
            />
        )
    }

    const renderRow = (row, rowInd, reverse) => {
        const [startInd, endInd, indStep] = !reverse ? [0, DIMS, 1] : [DIMS - 1, -1, -1]
        const rowElement = []

        for (let colInd = startInd; colInd !== endInd; colInd += indStep) {
            rowElement.push(
                renderSquare(chessUtils.pieceLookup[row[colInd]], {
                    row: rowInd,
                    col: colInd
                })
            )
        }
        return (
            <div key={100 + rowInd} className='board-row'>
                {rowElement}
            </div>
        )
    }

    const renderBoard = () => {
        // Really need the old school loops - reversing causes problems, as does auto
        // generation of index with forEach
        const [startInd, endInd, indStep] = reverse ? [0, DIMS, 1] : [DIMS - 1, -1, -1]
        const boardElement = []

        for (let rowInd = startInd; rowInd !== endInd; rowInd += indStep) {
            boardElement.push(renderRow(position[rowInd], rowInd, reverse))
        }
        return boardElement
    }

    const handleReverseClick = reverseIn => {
        setReverse(reverseIn)
    }

    return (
        <div>
            <button onClick={() => handleReverseClick(!reverse)}>{reverse ? '^' : 'v'}</button>
            &nbsp; <b>{message}</b>
            <div className='game-board'>{renderBoard()}</div>
        </div>
    )
}

export default DumbBoard
