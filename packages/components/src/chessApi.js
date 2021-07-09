import Chess from 'chess.js'

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
    /* eslint-disable */
    return {
        chess_ob: game,
        moves: game.history(),
        legalMoves: mappedMoves,
        position: game.board().map(
            row => row.map(
                el =>
                el
                    ? el.color === 'b' ? el.type : el.type.toUpperCase()
                    : ''
            )
        ).reverse()
    }
    /* eslint-enable */
}

export const calcGame = moves => {
    const game = new Chess()
    moves.forEach(element => {
        game.move(element)
    })
    return game
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
