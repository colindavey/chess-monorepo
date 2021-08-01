import React, { useState } from 'react';
import Chess from 'chess.js';

var styles = {"test":"_styles-module__test__3ybTi"};

const DIMS = 8;
const WHITE_KING = '\u2654';
const WHITE_QUEEN = '\u2655';
const WHITE_ROOK = '\u2656';
const WHITE_BISHOP = '\u2657';
const WHITE_KNIGHT = '\u2658';
const WHITE_PAWN = '\u2659';
const BLACK_KING = '\u265A';
const BLACK_QUEEN = '\u265B';
const BLACK_ROOK = '\u265C';
const BLACK_BISHOP = '\u265D';
const BLACK_KNIGHT = '\u265E';
const BLACK_PAWN = '\u265F';
const pieceLookup = {
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
};
function boardCoord2key(nDims, boardCoord) {
  return nDims * boardCoord.row + boardCoord.col;
}
function piece2Color(piece) {
  if (!piece) {
    return null;
  }

  return piece.toUpperCase() === piece ? 'W' : 'B';
}
function moveNum2Color(moveNum) {
  return moveNum % 2 === 0 ? 'W' : 'B';
}
function boardCoord2uci(boardCoord) {
  const file = String.fromCharCode('a'.charCodeAt() + boardCoord.col);
  const rank = boardCoord.row + 1;
  return `${file}${rank}`;
}
function getLegalDestsFrom(boardCoord, legalMoves) {
  const startCoord = boardCoord2uci(boardCoord);
  const legalMovesFiltered = legalMoves.filter(m => m.slice(0, 2) === startCoord);
  const legalDests = legalMovesFiltered.map(m => m.slice(2));
  return legalDests;
}
function checkLegalPos(position, castle) {
  const positionStats = {
    K: {
      locations: [],
      count: 0
    },
    Q: {
      locations: [],
      count: 0
    },
    R: {
      locations: [],
      count: 0
    },
    B: {
      locations: [],
      count: 0
    },
    N: {
      locations: [],
      count: 0
    },
    P: {
      locations: [],
      count: 0
    },
    k: {
      locations: [],
      count: 0
    },
    q: {
      locations: [],
      count: 0
    },
    r: {
      locations: [],
      count: 0
    },
    b: {
      locations: [],
      count: 0
    },
    n: {
      locations: [],
      count: 0
    },
    p: {
      locations: [],
      count: 0
    }
  };

  for (let row = 0; row < DIMS; row++) {
    for (let col = 0; col < DIMS; col++) {
      const piece = position[row][col];

      if (piece) {
        positionStats[piece].count++;
        positionStats[piece].locations.push({
          row: row,
          col: col
        });
      }
    }
  }

  const msg = [];
  const whiteKCount = positionStats.K.count;

  if (whiteKCount === 0) {
    msg.push('No White King.');
  }

  if (whiteKCount > 1) {
    msg.push(`${positionStats.K.count} White Kings (must be 1).`);
  }

  const blackKCount = positionStats.k.count;

  if (blackKCount === 0) {
    msg.push('No Black King.');
  }

  if (blackKCount > 1) {
    msg.push(`${positionStats.K.count} Black Kings (must be 1).`);
  }

  if (blackKCount === 1 && whiteKCount === 1) {
    if (Math.abs(positionStats.K.locations[0].row - positionStats.k.locations[0].row) <= 1 && Math.abs(positionStats.K.locations[0].col - positionStats.k.locations[0].col) <= 1) {
        msg.push('Kings are next to each other.');
      }
  }

  if (positionStats.P.count > 8) {
    msg.push(`${positionStats.P.count} White Pawns (must be 8 or fewer).`);
  }

  if (positionStats.p.count > 8) {
    msg.push(`${positionStats.P.count} Black Pawns (must be 8 or fewer).`);
  }

  if (position[0].includes('P')) {
    msg.push('White Pawn on back rank.');
  }

  if (position[7].includes('P')) {
    msg.push('White Pawn on eigth rank.');
  }

  if (position[7].includes('p')) {
    msg.push('Black Pawn on back rank.');
  }

  if (position[0].includes('p')) {
    msg.push('Black Pawn on eigth rank.');
  }

  const wKingOnOrig = position[0][4] === 'K';

  if (castle.includes('K')) {
    if (!wKingOnOrig) {
      msg.push('O-O available for White, but King not on original square.');
    }

    if (position[0][7] !== 'R') {
      msg.push("O-O available for White, but King's Rook not on original square.");
    }
  }

  if (castle.includes('Q')) {
    if (!wKingOnOrig) {
      msg.push('O-O-O available for White, but King not on original square.');
    }

    if (position[0][0] !== 'R') {
      msg.push("O-O-O available for White, but Queen's Rook not on original square.");
    }
  }

  const bKingOnOrig = position[7][4] === 'k';

  if (castle.includes('k')) {
    if (!bKingOnOrig) {
      msg.push('O-O available for Black, but King not on original square.');
    }

    if (position[7][7] !== 'r') {
      msg.push("O-O available for Black, but King's Rook not on original square.");
    }
  }

  if (castle.includes('q')) {
    if (!bKingOnOrig) {
      msg.push('O-O-O available for Black, but King not on original square.');
    }

    if (position[7][0] !== 'r') {
      msg.push("O-O-O available for Black, but Queen's Rook not on original square.");
    }
  }

  return msg;
}

const Square = ({
  onClick,
  piece,
  highlighted,
  colorClass
}) => {
  const highlightClass = highlighted ? 'square-highlighted' : '';
  return /*#__PURE__*/React.createElement("button", {
    className: `square ${highlightClass} ${colorClass}`,
    onClick: onClick
  }, piece);
};

const DumbBoard = ({
  position,
  highlightList,
  handleClick
}) => {
  const [reverse, setReverse] = useState(false);

  const renderSquare = (piece, boardCoord) => {
    const highlighted = highlightList.includes(boardCoord2uci(boardCoord));
    const colorClass = boardCoord.row % 2 === boardCoord.col % 2 ? 'square-black' : 'square-white';
    return /*#__PURE__*/React.createElement(Square, {
      key: boardCoord2key(DIMS, boardCoord),
      piece: piece,
      onClick: () => handleClick(boardCoord),
      highlighted: highlighted,
      colorClass: colorClass
    });
  };

  const renderRow = (row, rowInd, reverse) => {
    const [startInd, endInd, indStep] = !reverse ? [0, DIMS, 1] : [DIMS - 1, -1, -1];
    const rowElement = [];

    for (let colInd = startInd; colInd !== endInd; colInd += indStep) {
      rowElement.push(renderSquare(pieceLookup[row[colInd]], {
        row: rowInd,
        col: colInd
      }));
    }

    return /*#__PURE__*/React.createElement("div", {
      key: 100 + rowInd,
      className: "board-row"
    }, rowElement);
  };

  const renderBoard = () => {
    const [startInd, endInd, indStep] = reverse ? [0, DIMS, 1] : [DIMS - 1, -1, -1];
    const boardElement = [];

    for (let rowInd = startInd; rowInd !== endInd; rowInd += indStep) {
      boardElement.push(renderRow(position[rowInd], rowInd, reverse));
    }

    return boardElement;
  };

  const handleReverseClick = reverseIn => {
    setReverse(reverseIn);
  };

  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => handleReverseClick(!reverse)
  }, reverse ? '^' : 'v'), /*#__PURE__*/React.createElement("div", {
    className: "game-board"
  }, renderBoard()));
};

const calcGame = (moves, fen) => {
  const game = fen ? new Chess(fen) : new Chess();
  moves.forEach(element => {
    game.move(element);
  });
  return game;
};
const board2Position = board => {
  return board.map(row => row.map(el => el ? el.color === 'b' ? el.type : el.type.toUpperCase() : '')).reverse();
};
const analyzeGame = game => {
  const msg = [];
  const turn = game.turn() === 'w' ? 'White' : 'Black';

  if (game.game_over()) {
    msg.push('Game over.');

    if (game.in_checkmate()) {
      msg.push(`${turn} is checkmated.`);
    } else if (game.in_draw()) {
      if (game.in_stalemate()) {
        msg.push('Draw by stalemate.');
      } else if (game.in_threefold_repetition()) {
        msg.push('Draw by threefold repetition.');
      } else if (game.insufficient_material()) {
        msg.push('Draw by insufficient material.');
      } else {
        msg.push('Draw by 50-move rule.');
      }
    }
  } else {
    msg.push(`${turn}'s turn.`);

    if (game.in_check()) {
      msg.push(`${turn} is in check.`);
    }
  }

  return msg;
};

const chessApiState = game => {
  const legalMoves = game.moves({
    verbose: true
  });
  const mappedMoves = legalMoves.map(move => `${move.from}${move.to}`);
  return {
    game: game,
    moves: game.history(),
    legalMoves: mappedMoves,
    position: board2Position(game.board()),
    status: analyzeGame(game)
  };
};

const initGame = (fen = null) => {
  const game = calcGame([], fen);
  return chessApiState(game);
};
const emptyGame = () => {
  const game = new Chess();
  game.clear();
  return chessApiState(game);
};
const fen2Game = fen => {
  const game = new Chess(fen);
  return chessApiState(game);
};
const initGameState = initGame();
const initPosition = initGameState.position;
const emptyGameState = emptyGame();
const emptyPosition = emptyGameState.position;
const analyzeFen = fen => {
  const game = new Chess(fen);
  return analyzeGame(game);
};
const setup2Fen = ({
  position,
  turn,
  castle,
  enPassantSquare,
  halfMoveClock,
  fullMoveNumber
}) => {
  const game = new Chess();
  game.clear();

  for (let rank = 0; rank < 8; rank++) {
    for (let file = 0; file < 8; file++) {
      const piece = position[rank][file];

      if (piece) {
        const color = piece2Color(piece).toLowerCase();
        const square = boardCoord2uci({
          col: file,
          row: rank
        });
        game.put({
          type: piece,
          color: color
        }, square);
      }
    }
  }

  const fenTmp = game.fen();
  const fenPos = fenTmp.split(' ')[0];
  const fen = `${fenPos} ${turn.toLowerCase()} ${castle} ${enPassantSquare} ${halfMoveClock} ${fullMoveNumber}`;
  return fen;
};
const inCheck = fen => {
  const game = new Chess(fen);
  return game.in_check();
};
const moveTo = (moves, fen) => {
  const game = calcGame(moves, fen);
  return chessApiState(game);
};
const moveAdd = (moves, newMove, fen) => {
  const game = calcGame(moves, fen);
  game.move(newMove, {
    sloppy: true
  });
  return chessApiState(game);
};

const SmartBoard = ({
  position,
  turn,
  onMove,
  legalMoves
}) => {
  const [click1, setClick1] = useState(null);
  const [legalDests, setLegalDests] = useState([]);
  const [highlightList, setHighlightList] = useState([]);

  const handleClick = boardCoord => {
    if (piece2Color(position[boardCoord.row][boardCoord.col]) === turn) {
      setClick1(boardCoord);
      const legalDests = getLegalDestsFrom(boardCoord, legalMoves);
      setLegalDests(legalDests);
      const highlightList = legalDests;
      highlightList.push(boardCoord2uci(boardCoord));
      setHighlightList(highlightList);
    } else {
      if (!click1) {
        return;
      }

      if (legalDests.includes(boardCoord2uci(boardCoord))) {
        onMove(click1, boardCoord);
      }

      setClick1(null);
      setHighlightList([]);
    }
  };

  return /*#__PURE__*/React.createElement(DumbBoard, {
    position: position,
    highlightList: highlightList,
    handleClick: handleClick
  });
};

const ChessListingGrid = ({
  moves,
  currentMoveNum,
  handleClick
}) => {
  const tableMoves = [];

  for (let i = 0; i < moves.length; i += 2) {
    tableMoves.push([{
      move: moves[i],
      index: i
    }, moves[i + 1] ? {
      move: moves[i + 1],
      index: i + 1
    } : '']);
  }

  const renderCol = (row, rowIndex) => {
    return row.map((col, colIndex) => {
      const index = `${rowIndex},${colIndex}`;
      const move = col.index + 1 === currentMoveNum ? /*#__PURE__*/React.createElement("b", null, col.move) : col.move;
      return col ? /*#__PURE__*/React.createElement("div", {
        key: index,
        className: "grid-cell grid-cell-button",
        onClick: () => handleClick(col.index + 1)
      }, move) : /*#__PURE__*/React.createElement("div", {
        key: index,
        className: "grid-cell"
      });
    });
  };

  const listing = tableMoves.map((row, index) => {
    const newCol = renderCol(row, index);
    return /*#__PURE__*/React.createElement("div", {
      key: index,
      className: "grid-wrapper"
    }, /*#__PURE__*/React.createElement("div", {
      className: "grid-cell"
    }, index + 1, "."), newCol);
  });
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "scroll"
  }, listing), /*#__PURE__*/React.createElement("button", {
    onClick: () => handleClick(0)
  }, "|<"), /*#__PURE__*/React.createElement("button", {
    onClick: () => handleClick(Math.max(currentMoveNum - 1, 0))
  }, "<"), /*#__PURE__*/React.createElement("button", {
    onClick: () => handleClick(Math.min(currentMoveNum + 1, moves.length))
  }, ">"), /*#__PURE__*/React.createElement("button", {
    onClick: () => handleClick(moves.length)
  }, ">|"));
};

const GameInfo = ({
  moves,
  status,
  currentMoveNum,
  handleListingClick
}) => {
  return /*#__PURE__*/React.createElement("div", {
    className: "game-info"
  }, status, /*#__PURE__*/React.createElement(ChessListingGrid, {
    moves: moves,
    currentMoveNum: currentMoveNum,
    handleClick: handleListingClick
  }));
};

const GameView = ({
  position,
  currentMoveNum,
  legalMoves,
  moves,
  status,
  handleMove,
  handleListingClick
}) => {
  return /*#__PURE__*/React.createElement("div", {
    className: "game"
  }, /*#__PURE__*/React.createElement(SmartBoard, {
    position: position,
    turn: moveNum2Color(currentMoveNum),
    onMove: handleMove,
    legalMoves: legalMoves
  }), /*#__PURE__*/React.createElement(GameInfo, {
    moves: moves,
    status: status,
    currentMoveNum: currentMoveNum,
    handleListingClick: handleListingClick
  }));
};

const Game = () => {
  const fen = 'k1K5/8/6P1/8/8/8/8/8 w - - 0 1';
  const initGameState = initGame(fen);
  const [moves, setMoves] = useState([]);
  const [currentMoveNum, setCurrentMoveNum] = useState(0);
  const [position, setPosition] = useState(initGameState.position);
  const [legalMoves, setLegalMoves] = useState(initGameState.legalMoves);
  const [status, setStatus] = useState(initGameState.status);

  const handleMove = (click1, click2) => {
    console.log('handleMove');
    const localMoves = moves.slice(0, currentMoveNum);
    console.log(position);
    const chessApiState = moveAdd(localMoves, `${boardCoord2uci(click1)}${boardCoord2uci(click2)}`, fen);
    console.log(chessApiState);
    setMoves(chessApiState.moves);
    updateState(chessApiState, localMoves.length + 1);
  };

  const handleListingClick = moveNum => {
    const chessApiState = moveTo(moves.slice(0, moveNum), fen);
    updateState(chessApiState, moveNum);
  };

  const updateState = ({
    position,
    legalMoves,
    status
  }, moveNum) => {
    console.log('updateState', position);
    setPosition(position);
    setLegalMoves(legalMoves);
    setCurrentMoveNum(moveNum);
    setStatus(status);
  };

  return /*#__PURE__*/React.createElement(GameView, {
    position: position,
    turn: moveNum2Color(currentMoveNum),
    legalMoves: legalMoves,
    moves: moves,
    status: status,
    currentMoveNum: currentMoveNum,
    handleMove: handleMove,
    handleListingClick: handleListingClick
  });
};

const ExampleComponent = ({
  text
}) => {
  return /*#__PURE__*/React.createElement("div", {
    className: styles.test
  }, "Example Component: ", text);
};

export { DIMS, DumbBoard, ExampleComponent, Game, analyzeFen, analyzeGame, board2Position, boardCoord2key, boardCoord2uci, calcGame, checkLegalPos, emptyGame, emptyPosition, fen2Game, getLegalDestsFrom, inCheck, initGame, initGameState, initPosition, moveAdd, moveNum2Color, moveTo, piece2Color, pieceLookup, setup2Fen };
//# sourceMappingURL=index.modern.js.map
