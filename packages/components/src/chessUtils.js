export const DIMS = 8

const WHITE_KING = '\u2654'
const WHITE_QUEEN = '\u2655'
const WHITE_ROOK = '\u2656'
const WHITE_BISHOP = '\u2657'
const WHITE_KNIGHT = '\u2658'
const WHITE_PAWN = '\u2659'
const BLACK_KING = '\u265A'
const BLACK_QUEEN = '\u265B'
const BLACK_ROOK = '\u265C'
const BLACK_BISHOP = '\u265D'
const BLACK_KNIGHT = '\u265E'
const BLACK_PAWN = '\u265F'

export const pieceLookup = {
    K: WHITE_KING,
    Q: WHITE_QUEEN,
    R: WHITE_ROOK,
    B: WHITE_BISHOP,
    N: WHITE_KNIGHT,
    P: WHITE_PAWN,
    k: BLACK_KING,
    q: BLACK_QUEEN,
    r: BLACK_ROOK,
    b: BLACK_BISHOP,
    n: BLACK_KNIGHT,
    p: BLACK_PAWN
}

export function boardCoord2key(nDims, boardCoord) {
    // eslint-disable-next-line prettier/prettier
    return (nDims * boardCoord.row) + boardCoord.col
}

export function piece2Color(piece) {
    if (!piece) {
        return null
    }
    return piece.toUpperCase() === piece ? 'W' : 'B'
}

export function moveNum2Color(moveNum) {
    // eslint-disable-next-line prettier/prettier
    return ((moveNum % 2) === 0) ? 'W' : 'B'
}

export function boardCoord2uci(boardCoord) {
    const file = String.fromCharCode('a'.charCodeAt() + boardCoord.col)
    const rank = boardCoord.row + 1
    return `${file}${rank}`
}

// function uci2boardCoord(uci) {
//     return {row: parseInt(uci.slice(1))-1, col: uci.slice(0, 1).charCodeAt() - "a".charCodeAt()}
// }

export function getLegalDestsFrom(boardCoord, legalMoves) {
    const startCoord = boardCoord2uci(boardCoord)
    // filter the legal moves down to those starting from the boardCoord
    const legalMovesFiltered = legalMoves.filter(
        m => m.slice(0, 2) === startCoord
    )
    // e.g. maps ["e2e3", "e2e4"] to ["e3", "e4"]
    const legalDests = legalMovesFiltered.map(m => m.slice(2))
    return legalDests
}

export function checkLegalPos(position, castle) {
    const positionStats = {
        K: { locations: [], count: 0 },
        Q: { locations: [], count: 0 },
        R: { locations: [], count: 0 },
        B: { locations: [], count: 0 },
        N: { locations: [], count: 0 },
        P: { locations: [], count: 0 },
        k: { locations: [], count: 0 },
        q: { locations: [], count: 0 },
        r: { locations: [], count: 0 },
        b: { locations: [], count: 0 },
        n: { locations: [], count: 0 },
        p: { locations: [], count: 0 }
    }
    for (let row = 0; row < DIMS; row++) {
        for (let col = 0; col < DIMS; col++) {
            const piece = position[row][col]
            if (piece) {
                positionStats[piece].count++
                positionStats[piece].locations.push({ row: row, col: col })
            }
        }
    }
    const msg = []
    const whiteKCount = positionStats.K.count
    if (whiteKCount === 0) {
        msg.push('No White King.')
    }
    if (whiteKCount > 1) {
        msg.push(`${positionStats.K.count} White Kings (must be 1).`)
    }

    const blackKCount = positionStats.k.count
    if (blackKCount === 0) {
        msg.push('No Black King.')
    }
    if (blackKCount > 1) {
        msg.push(`${positionStats.K.count} Black Kings (must be 1).`)
    }

    if (blackKCount === 1 && whiteKCount === 1) {
        if (
            /* eslint-disable */
            Math.abs(positionStats.K.locations[0].row - positionStats.k.locations[0].row) <= 1
            &&
            Math.abs(positionStats.K.locations[0].col - positionStats.k.locations[0].col) <= 1
            /* eslint-enable */
        ) {
            msg.push('Kings are next to each other.')
        }
    }

    if (positionStats.P.count > 8) {
        msg.push(`${positionStats.P.count} White Pawns (must be 8 or fewer).`)
    }
    if (positionStats.p.count > 8) {
        msg.push(`${positionStats.P.count} Black Pawns (must be 8 or fewer).`)
    }
    if (position[0].includes('P')) {
        msg.push('White Pawn on back rank.')
    }
    if (position[7].includes('P')) {
        msg.push('White Pawn on eigth rank.')
    }
    if (position[7].includes('p')) {
        msg.push('Black Pawn on back rank.')
    }
    if (position[0].includes('p')) {
        msg.push('Black Pawn on eigth rank.')
    }
    // Check White castling
    const wKingOnOrig = position[0][4] === 'K'
    if (castle.includes('K')) {
        if (!wKingOnOrig) {
            msg.push(
                'O-O available for White, but King not on original square.'
            )
        }
        if (position[0][7] !== 'R') {
            msg.push(
                "O-O available for White, but King's Rook not on original square."
            )
        }
    }
    if (castle.includes('Q')) {
        if (!wKingOnOrig) {
            msg.push(
                'O-O-O available for White, but King not on original square.'
            )
        }
        if (position[0][0] !== 'R') {
            msg.push(
                "O-O-O available for White, but Queen's Rook not on original square."
            )
        }
    }
    // Check Black castling
    const bKingOnOrig = position[7][4] === 'k'
    if (castle.includes('k')) {
        if (!bKingOnOrig) {
            msg.push(
                'O-O available for Black, but King not on original square.'
            )
        }
        if (position[7][7] !== 'r') {
            msg.push(
                "O-O available for Black, but King's Rook not on original square."
            )
        }
    }
    if (castle.includes('q')) {
        if (!bKingOnOrig) {
            msg.push(
                'O-O-O available for Black, but King not on original square.'
            )
        }
        if (position[7][0] !== 'r') {
            msg.push(
                "O-O-O available for Black, but Queen's Rook not on original square."
            )
        }
    }
    return msg
}
