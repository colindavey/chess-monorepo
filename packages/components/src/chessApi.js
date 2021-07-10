import Chess from 'chess.js'
import * as chessUtils from './chessUtils.js'

export const emptyPosition = [
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '']
]

const chessApiState = game => {
    const legalMoves = game.moves({ verbose: true })
    const mappedMoves = legalMoves.map(move => `${move.from}${move.to}`)
    return {
        chess_ob: game,
        moves: game.history(),
        legalMoves: mappedMoves,
        position: board2Position(game.board())
    }
}

export const setup2Fen = ({
    position,
    turn,
    castle,
    enPassantSquare,
    halfMove,
    fullMove
}) => {
    const game = new Chess()
    game.clear()
    for (let rank = 0; rank < 8; rank++) {
        for (let file = 0; file < 8; file++) {
            const piece = position[rank][file]
            if (piece) {
                console.log('piece', piece)
                const color = chessUtils.piece2Color(piece).toLowerCase()
                console.log('color', color)
                const square = chessUtils.boardCoord2uci({
                    col: file,
                    row: rank
                })
                game.put({ type: piece, color: color }, square)
            }
        }
    }
    const fenTmp = game.fen()
    const fenPos = fenTmp.split(' ')[0]
    // const fen = `${fenTmp} ++++ ${fenPos} ${turn.toLowerCase()} ${castle} ${enPassantSquare} ${halfMove} ${fullMove}`
    const fen = `${fenPos} ${turn.toLowerCase()} ${castle} ${enPassantSquare} ${halfMove} ${fullMove}`
    return fen
}

export const board2Position = board => {
    /* eslint-disable */
    return board.map(
        row => row.map(
            el =>
            el
                ? el.color === 'b' ? el.type : el.type.toUpperCase()
                : ''
        )
    ).reverse()
    /* eslint-enable */
}

export const calcGame = moves => {
    const game = new Chess()
    moves.forEach(element => {
        game.move(element)
    })
    return game
}

export const empty = () => {
    const game = new Chess()
    game.clear()
    return chessApiState(game)
}

export const init = () => {
    const game = calcGame([])
    return chessApiState(game)
}

export const moveTo = moves => {
    const game = calcGame(moves)
    return chessApiState(game)
}

export const moveAdd = (moves, newMove) => {
    const game = calcGame(moves)
    game.move(newMove, { sloppy: true })
    return chessApiState(game)
}
