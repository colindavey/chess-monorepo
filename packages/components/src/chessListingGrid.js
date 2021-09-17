import React from 'react'
/**
 * Shows the move history, with current move highlighted.
 * Allows client to move to clicked move with the handleClick
 * callback.
 * Provides button to go to setup with the current position.
 */
const ChessListingGrid = ({
    moves,
    currentMoveNum,
    handleClick,
    initTurn,
    initFullMoveNumber,
    setupUrl,
    fen
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

export default ChessListingGrid
