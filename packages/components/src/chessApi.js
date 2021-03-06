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

// Local functions
const calcGame = (moves, fen) => {
    const game = fen ? new Chess(fen) : new Chess()
    moves.forEach(element => {
        game.move(element)
    })
    return game
}

const board2Position = board => {
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

const analyzeGame = game => {
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

const chessApiState = game => {
    const legalMoves = game.moves({ verbose: true })
    const mappedMoves = legalMoves.map(move => `${move.from}${move.to}`)
    return {
        game: game,
        moves: game.history(),
        legalMoves: mappedMoves,
        position: board2Position(game.board()),
        status: analyzeGame(game),
        over: game.game_over(),
        fen: game.fen()
    }
}

const emptyGame = () => {
    const game = new Chess()
    game.clear()
    return chessApiState(game)
}

// Not called by anything
// const fen2Game = fen => {
//     const game = new Chess(fen)
//     return chessApiState(game)
// }

// Public Functions used by setPosition.js
export const analyzeFen = fen => {
    const game = new Chess(fen)
    return analyzeGame(game)
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

export const fen2Setup = fen => {
    const game = new Chess(fen)
    const array = fen.split(' ')
    const state = chessApiState(game)
    const result = {
        position: state.position,
        turn: array[1].toUpperCase(),
        castle: array[2],
        enPassantSquare: array[3],
        halfMoveClock: array[4],
        fullMoveNumber: array[5]
    }
    // console.log(result)
    return result
}

export const inCheck = fen => {
    const game = new Chess(fen)
    return game.in_check()
}

// Public Functions used by game.js
// All return chessApiState object
export const initGame = (fen = null) => {
    const game = calcGame([], fen)
    return chessApiState(game)
}

export const moveTo = (moves, fen) => {
    const game = calcGame(moves, fen)
    return chessApiState(game)
}

export const moveAdd = (moves, newMove, fen) => {
    const game = calcGame(moves, fen)
    game.move(newMove, { sloppy: true })
    return chessApiState(game)
}

// Variables
const initGameState = initGame()
const emptyGameState = emptyGame()
export const initPosition = initGameState.position
export const emptyPosition = emptyGameState.position
