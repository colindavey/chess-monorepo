/* eslint-disable prettier/prettier */
export function boardCoord2key(nDims, boardCoord) {
    return (nDims * boardCoord.row) + boardCoord.col
}

export function piece2Color(piece) {
    if (!piece) {
        return null;
    }
    return piece.toUpperCase() === piece ? 'W' : 'B'
}

export function moveNum2Color(moveNum) {
    return ((moveNum % 2) === 0) ? 'W' : 'B';
}

export function boardCoord2uci(boardCoord) {
    const file = String.fromCharCode('a'.charCodeAt()+boardCoord.col)
    const rank = boardCoord.row+1;
    return `${file}${rank}`;
}

// function uci2boardCoord(uci) {
//     return {row: parseInt(uci.slice(1))-1, col: uci.slice(0, 1).charCodeAt() - "a".charCodeAt()}
// }

export function getLegalDestsFrom(boardCoord, legalMoves) {
    const startCoord = boardCoord2uci(boardCoord);
    // filter the legal moves down to those starting from the boardCoord
    const legalMovesFiltered = legalMoves.filter( m => m.slice(0, 2) === startCoord );
    // e.g. maps ["e2e3", "e2e4"] to ["e3", "e4"] 
    const legalDests = legalMovesFiltered.map( m => m.slice(2));
    return legalDests
}
