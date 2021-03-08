import Chess from 'chess.js';

const chess_api_state = (game) => {
    const legal_moves = game.moves({verbose: true});
    const mapped_moves = legal_moves.map(move => `${move.from}${move.to}`);
    return {
        chess_ob: game, 
        moves: game.history(), 
        legal_moves: mapped_moves, 
        position: game.board().map(
            row => row.map(
                el => 
                el ? 
                    el.color === 'b' ? el.type : el.type.toUpperCase()
                : ''
                )
        ).reverse()
    };
}

export const calc_game = moves => {
    const game = new Chess();
    moves.forEach(element => {
        game.move(element);        
    });
    return game;
}

export const init = () => {
    const game = calc_game([]);
    return chess_api_state(game);
}

export const move_to = (moves) => {
    const game = calc_game(moves);
    return chess_api_state(game);
}

export const move_add = (moves, new_move) => {
    const game = calc_game(moves);
    game.move(new_move, {sloppy: true});
    return chess_api_state(game);
}