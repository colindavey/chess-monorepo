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
