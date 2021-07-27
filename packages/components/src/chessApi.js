import Chess from 'chess.js'
import * as chessUtils from './chessUtils.js'

// export const emptyPosition = [
//     ['', '', '', '', '', '', '', ''],
//     ['', '', '', '', '', '', '', ''],
//     ['', '', '', '', '', '', '', ''],
//     ['', '', '', '', '', '', '', ''],
//     ['', '', '', '', '', '', '', ''],
//     ['', '', '', '', '', '', '', ''],
//     ['', '', '', '', '', '', '', ''],
//     ['', '', '', '', '', '', '', '']
// ]

export const calcGame = moves => {
    const game = new Chess()
    moves.forEach(element => {
        game.move(element)
    })
    return game
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

const chessApiState = game => {
    const legalMoves = game.moves({ verbose: true })
    const mappedMoves = legalMoves.map(move => `${move.from}${move.to}`)
    return {
        chess_ob: game,
        moves: game.history(),
        legalMoves: mappedMoves,
        position: board2Position(game.board()),
        status: analyzeGame(game)
    }
}

export const initGame = () => {
    const game = calcGame([])
    return chessApiState(game)
}

export const emptyGame = () => {
    const game = new Chess()
    game.clear()
    return chessApiState(game)
}

const initGameState = initGame()
export const initPosition = initGameState.position
const emptyGameState = emptyGame()
export const emptyPosition = emptyGameState.position

export const analyzeFen = fen => {
    const game = new Chess(fen)
    return analyzeGame(game)
}

export const analyzeGame = game => {
    const msg = []
    const turn = game.turn() === 'w' ? 'White' : 'Black'
    if (game.game_over()) {
        msg.push('Game over.')
        if (game.in_checkmate()) {
            msg.push(`${turn} is checkmated.`)
        } else if (game.in_draw()) {
            if (game.in_stalemate()) {
                msg.push('Draw by stalemate.')
            } else if (game.in_threefold_repetition()) {
                msg.push('Draw by threefold repetition.')
            } else if (game.insufficient_material()) {
                msg.push('Draw by insufficient material.')
            } else {
                msg.push('Draw by 50-move rule.')
            }
        }
    } else {
        msg.push(`${turn}'s turn.`)
        if (game.in_check()) {
            msg.push(`${turn} is in check.`)
        }
    }
    return msg
}

export const setup2Fen = ({
    position,
    turn,
    castle,
    enPassantSquare,
    halfMoveClock,
    fullMoveNumber
}) => {
    const game = new Chess()
    game.clear()
    for (let rank = 0; rank < 8; rank++) {
        for (let file = 0; file < 8; file++) {
            const piece = position[rank][file]
            if (piece) {
                const color = chessUtils.piece2Color(piece).toLowerCase()
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
    const fen = `${fenPos} ${turn.toLowerCase()} ${castle} ${enPassantSquare} ${halfMoveClock} ${fullMoveNumber}`
    return fen
}

export const inCheck = fen => {
    const game = new Chess(fen)
    return game.in_check()
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
