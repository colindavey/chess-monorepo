function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var Chess = _interopDefault(require('chess.js'));

var styles = {"test":"_styles-module__test__3ybTi"};

var DIMS = 8;
var WHITE_KING = "\u2654";
var WHITE_QUEEN = "\u2655";
var WHITE_ROOK = "\u2656";
var WHITE_BISHOP = "\u2657";
var WHITE_KNIGHT = "\u2658";
var WHITE_PAWN = "\u2659";
var BLACK_KING = "\u265A";
var BLACK_QUEEN = "\u265B";
var BLACK_ROOK = "\u265C";
var BLACK_BISHOP = "\u265D";
var BLACK_KNIGHT = "\u265E";
var BLACK_PAWN = "\u265F";
var pieceLookup = {
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
  var file = String.fromCharCode('a'.charCodeAt() + boardCoord.col);
  var rank = boardCoord.row + 1;
  return "" + file + rank;
}
function getLegalDestsFrom(boardCoord, legalMoves) {
  var startCoord = boardCoord2uci(boardCoord);
  var legalMovesFiltered = legalMoves.filter(function (m) {
    return m.slice(0, 2) === startCoord;
  });
  var legalDests = legalMovesFiltered.map(function (m) {
    return m.slice(2);
  });
  return legalDests;
}
function checkLegalPos(position, castle) {
  var positionStats = {
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

  for (var row = 0; row < DIMS; row++) {
    for (var col = 0; col < DIMS; col++) {
      var piece = position[row][col];

      if (piece) {
        positionStats[piece].count++;
        positionStats[piece].locations.push({
          row: row,
          col: col
        });
      }
    }
  }

  var msg = [];
  var whiteKCount = positionStats.K.count;

  if (whiteKCount === 0) {
    msg.push('No White King.');
  }

  if (whiteKCount > 1) {
    msg.push(positionStats.K.count + " White Kings (must be 1).");
  }

  var blackKCount = positionStats.k.count;

  if (blackKCount === 0) {
    msg.push('No Black King.');
  }

  if (blackKCount > 1) {
    msg.push(positionStats.K.count + " Black Kings (must be 1).");
  }

  if (blackKCount === 1 && whiteKCount === 1) {
    if (Math.abs(positionStats.K.locations[0].row - positionStats.k.locations[0].row) <= 1 && Math.abs(positionStats.K.locations[0].col - positionStats.k.locations[0].col) <= 1) {
        msg.push('Kings are next to each other.');
      }
  }

  if (positionStats.P.count > 8) {
    msg.push(positionStats.P.count + " White Pawns (must be 8 or fewer).");
  }

  if (positionStats.p.count > 8) {
    msg.push(positionStats.P.count + " Black Pawns (must be 8 or fewer).");
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

  var wKingOnOrig = position[0][4] === 'K';

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

  var bKingOnOrig = position[7][4] === 'k';

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

var Square = function Square(_ref) {
  var onClick = _ref.onClick,
      piece = _ref.piece,
      highlighted = _ref.highlighted,
      colorClass = _ref.colorClass;
  var highlightClass = highlighted ? 'square-highlighted' : '';
  return /*#__PURE__*/React__default.createElement("button", {
    className: "square " + highlightClass + " " + colorClass,
    onClick: onClick
  }, piece);
};

var DumbBoard = function DumbBoard(_ref2) {
  var position = _ref2.position,
      highlightList = _ref2.highlightList,
      handleClick = _ref2.handleClick;

  var _useState = React.useState(false),
      reverse = _useState[0],
      setReverse = _useState[1];

  var renderSquare = function renderSquare(piece, boardCoord) {
    var highlighted = highlightList.includes(boardCoord2uci(boardCoord));
    var colorClass = boardCoord.row % 2 === boardCoord.col % 2 ? 'square-black' : 'square-white';
    return /*#__PURE__*/React__default.createElement(Square, {
      key: boardCoord2key(DIMS, boardCoord),
      piece: piece,
      onClick: function onClick() {
        return handleClick(boardCoord);
      },
      highlighted: highlighted,
      colorClass: colorClass
    });
  };

  var renderRow = function renderRow(row, rowInd, reverse) {
    var _ref3 = !reverse ? [0, DIMS, 1] : [DIMS - 1, -1, -1],
        startInd = _ref3[0],
        endInd = _ref3[1],
        indStep = _ref3[2];

    var rowElement = [];

    for (var colInd = startInd; colInd !== endInd; colInd += indStep) {
      rowElement.push(renderSquare(pieceLookup[row[colInd]], {
        row: rowInd,
        col: colInd
      }));
    }

    return /*#__PURE__*/React__default.createElement("div", {
      key: 100 + rowInd,
      className: "board-row"
    }, rowElement);
  };

  var renderBoard = function renderBoard() {
    var _ref4 = reverse ? [0, DIMS, 1] : [DIMS - 1, -1, -1],
        startInd = _ref4[0],
        endInd = _ref4[1],
        indStep = _ref4[2];

    var boardElement = [];

    for (var rowInd = startInd; rowInd !== endInd; rowInd += indStep) {
      boardElement.push(renderRow(position[rowInd], rowInd, reverse));
    }

    return boardElement;
  };

  var handleReverseClick = function handleReverseClick(reverseIn) {
    setReverse(reverseIn);
  };

  return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("button", {
    onClick: function onClick() {
      return handleReverseClick(!reverse);
    }
  }, reverse ? '^' : 'v'), /*#__PURE__*/React__default.createElement("div", {
    className: "game-board"
  }, renderBoard()));
};

var calcGame = function calcGame(moves, fen) {
  var game = fen ? new Chess(fen) : new Chess();
  moves.forEach(function (element) {
    game.move(element);
  });
  return game;
};
var board2Position = function board2Position(board) {
  return board.map(function (row) {
    return row.map(function (el) {
      return el ? el.color === 'b' ? el.type : el.type.toUpperCase() : '';
    });
  }).reverse();
};
var analyzeGame = function analyzeGame(game) {
  var msg = [];
  var turn = game.turn() === 'w' ? 'White' : 'Black';

  if (game.game_over()) {
    msg.push('Game over.');

    if (game.in_checkmate()) {
      msg.push(turn + " is checkmated.");
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
    msg.push(turn + "'s turn.");

    if (game.in_check()) {
      msg.push(turn + " is in check.");
    }
  }

  return msg;
};

var chessApiState = function chessApiState(game) {
  var legalMoves = game.moves({
    verbose: true
  });
  var mappedMoves = legalMoves.map(function (move) {
    return "" + move.from + move.to;
  });
  return {
    game: game,
    moves: game.history(),
    legalMoves: mappedMoves,
    position: board2Position(game.board()),
    status: analyzeGame(game)
  };
};

var initGame = function initGame(fen) {
  if (fen === void 0) {
    fen = null;
  }

  var game = calcGame([], fen);
  return chessApiState(game);
};
var emptyGame = function emptyGame() {
  var game = new Chess();
  game.clear();
  return chessApiState(game);
};
var fen2Game = function fen2Game(fen) {
  var game = new Chess(fen);
  return chessApiState(game);
};
var initGameState = initGame();
var initPosition = initGameState.position;
var emptyGameState = emptyGame();
var emptyPosition = emptyGameState.position;
var analyzeFen = function analyzeFen(fen) {
  var game = new Chess(fen);
  return analyzeGame(game);
};
var setup2Fen = function setup2Fen(_ref) {
  var position = _ref.position,
      turn = _ref.turn,
      castle = _ref.castle,
      enPassantSquare = _ref.enPassantSquare,
      halfMoveClock = _ref.halfMoveClock,
      fullMoveNumber = _ref.fullMoveNumber;
  var game = new Chess();
  game.clear();

  for (var rank = 0; rank < 8; rank++) {
    for (var file = 0; file < 8; file++) {
      var piece = position[rank][file];

      if (piece) {
        var color = piece2Color(piece).toLowerCase();
        var square = boardCoord2uci({
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

  var fenTmp = game.fen();
  var fenPos = fenTmp.split(' ')[0];
  var fen = fenPos + " " + turn.toLowerCase() + " " + castle + " " + enPassantSquare + " " + halfMoveClock + " " + fullMoveNumber;
  return fen;
};
var inCheck = function inCheck(fen) {
  var game = new Chess(fen);
  return game.in_check();
};
var moveTo = function moveTo(moves, fen) {
  var game = calcGame(moves, fen);
  return chessApiState(game);
};
var moveAdd = function moveAdd(moves, newMove, fen) {
  var game = calcGame(moves, fen);
  game.move(newMove, {
    sloppy: true
  });
  return chessApiState(game);
};

var SmartBoard = function SmartBoard(_ref) {
  var position = _ref.position,
      turn = _ref.turn,
      onMove = _ref.onMove,
      legalMoves = _ref.legalMoves;

  var _useState = React.useState(null),
      click1 = _useState[0],
      setClick1 = _useState[1];

  var _useState2 = React.useState([]),
      legalDests = _useState2[0],
      setLegalDests = _useState2[1];

  var _useState3 = React.useState([]),
      highlightList = _useState3[0],
      setHighlightList = _useState3[1];

  var handleClick = function handleClick(boardCoord) {
    if (piece2Color(position[boardCoord.row][boardCoord.col]) === turn) {
      setClick1(boardCoord);

      var _legalDests = getLegalDestsFrom(boardCoord, legalMoves);

      setLegalDests(_legalDests);
      var _highlightList = _legalDests;

      _highlightList.push(boardCoord2uci(boardCoord));

      setHighlightList(_highlightList);
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

  return /*#__PURE__*/React__default.createElement(DumbBoard, {
    position: position,
    highlightList: highlightList,
    handleClick: handleClick
  });
};

var ChessListingGrid = function ChessListingGrid(_ref2) {
  var moves = _ref2.moves,
      currentMoveNum = _ref2.currentMoveNum,
      handleClick = _ref2.handleClick;
  var tableMoves = [];

  for (var i = 0; i < moves.length; i += 2) {
    tableMoves.push([{
      move: moves[i],
      index: i
    }, moves[i + 1] ? {
      move: moves[i + 1],
      index: i + 1
    } : '']);
  }

  var renderCol = function renderCol(row, rowIndex) {
    return row.map(function (col, colIndex) {
      var index = rowIndex + "," + colIndex;
      var move = col.index + 1 === currentMoveNum ? /*#__PURE__*/React__default.createElement("b", null, col.move) : col.move;
      return col ? /*#__PURE__*/React__default.createElement("div", {
        key: index,
        className: "grid-cell grid-cell-button",
        onClick: function onClick() {
          return handleClick(col.index + 1);
        }
      }, move) : /*#__PURE__*/React__default.createElement("div", {
        key: index,
        className: "grid-cell"
      });
    });
  };

  var listing = tableMoves.map(function (row, index) {
    var newCol = renderCol(row, index);
    return /*#__PURE__*/React__default.createElement("div", {
      key: index,
      className: "grid-wrapper"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "grid-cell"
    }, index + 1, "."), newCol);
  });
  return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("div", {
    className: "scroll"
  }, listing), /*#__PURE__*/React__default.createElement("button", {
    onClick: function onClick() {
      return handleClick(0);
    }
  }, "|<"), /*#__PURE__*/React__default.createElement("button", {
    onClick: function onClick() {
      return handleClick(Math.max(currentMoveNum - 1, 0));
    }
  }, "<"), /*#__PURE__*/React__default.createElement("button", {
    onClick: function onClick() {
      return handleClick(Math.min(currentMoveNum + 1, moves.length));
    }
  }, ">"), /*#__PURE__*/React__default.createElement("button", {
    onClick: function onClick() {
      return handleClick(moves.length);
    }
  }, ">|"));
};

var GameInfo = function GameInfo(_ref3) {
  var moves = _ref3.moves,
      status = _ref3.status,
      currentMoveNum = _ref3.currentMoveNum,
      handleListingClick = _ref3.handleListingClick;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "game-info"
  }, status, /*#__PURE__*/React__default.createElement(ChessListingGrid, {
    moves: moves,
    currentMoveNum: currentMoveNum,
    handleClick: handleListingClick
  }));
};

var GameView = function GameView(_ref4) {
  var position = _ref4.position,
      currentMoveNum = _ref4.currentMoveNum,
      legalMoves = _ref4.legalMoves,
      moves = _ref4.moves,
      status = _ref4.status,
      handleMove = _ref4.handleMove,
      handleListingClick = _ref4.handleListingClick;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "game"
  }, /*#__PURE__*/React__default.createElement(SmartBoard, {
    position: position,
    turn: moveNum2Color(currentMoveNum),
    onMove: handleMove,
    legalMoves: legalMoves
  }), /*#__PURE__*/React__default.createElement(GameInfo, {
    moves: moves,
    status: status,
    currentMoveNum: currentMoveNum,
    handleListingClick: handleListingClick
  }));
};

var Game = function Game() {
  var fen = 'k1K5/8/6P1/8/8/8/8/8 w - - 0 1';
  var initGameState = initGame(fen);

  var _useState4 = React.useState([]),
      moves = _useState4[0],
      setMoves = _useState4[1];

  var _useState5 = React.useState(0),
      currentMoveNum = _useState5[0],
      setCurrentMoveNum = _useState5[1];

  var _useState6 = React.useState(initGameState.position),
      position = _useState6[0],
      setPosition = _useState6[1];

  var _useState7 = React.useState(initGameState.legalMoves),
      legalMoves = _useState7[0],
      setLegalMoves = _useState7[1];

  var _useState8 = React.useState(initGameState.status),
      status = _useState8[0],
      setStatus = _useState8[1];

  var handleMove = function handleMove(click1, click2) {
    console.log('handleMove');
    var localMoves = moves.slice(0, currentMoveNum);
    console.log(position);
    var chessApiState = moveAdd(localMoves, "" + boardCoord2uci(click1) + boardCoord2uci(click2), fen);
    console.log(chessApiState);
    setMoves(chessApiState.moves);
    updateState(chessApiState, localMoves.length + 1);
  };

  var handleListingClick = function handleListingClick(moveNum) {
    var chessApiState = moveTo(moves.slice(0, moveNum), fen);
    updateState(chessApiState, moveNum);
  };

  var updateState = function updateState(_ref5, moveNum) {
    var position = _ref5.position,
        legalMoves = _ref5.legalMoves,
        status = _ref5.status;
    console.log('updateState', position);
    setPosition(position);
    setLegalMoves(legalMoves);
    setCurrentMoveNum(moveNum);
    setStatus(status);
  };

  return /*#__PURE__*/React__default.createElement(GameView, {
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

var ExampleComponent = function ExampleComponent(_ref) {
  var text = _ref.text;
  return /*#__PURE__*/React__default.createElement("div", {
    className: styles.test
  }, "Example Component: ", text);
};

exports.DIMS = DIMS;
exports.DumbBoard = DumbBoard;
exports.ExampleComponent = ExampleComponent;
exports.Game = Game;
exports.analyzeFen = analyzeFen;
exports.analyzeGame = analyzeGame;
exports.board2Position = board2Position;
exports.boardCoord2key = boardCoord2key;
exports.boardCoord2uci = boardCoord2uci;
exports.calcGame = calcGame;
exports.checkLegalPos = checkLegalPos;
exports.emptyGame = emptyGame;
exports.emptyPosition = emptyPosition;
exports.fen2Game = fen2Game;
exports.getLegalDestsFrom = getLegalDestsFrom;
exports.inCheck = inCheck;
exports.initGame = initGame;
exports.initGameState = initGameState;
exports.initPosition = initPosition;
exports.moveAdd = moveAdd;
exports.moveNum2Color = moveNum2Color;
exports.moveTo = moveTo;
exports.piece2Color = piece2Color;
exports.pieceLookup = pieceLookup;
exports.setup2Fen = setup2Fen;
//# sourceMappingURL=index.js.map
