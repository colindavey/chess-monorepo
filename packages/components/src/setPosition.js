import React, { useState } from 'react'
import DumbBoard from './dumbBoard'
import * as chessApi from './chessApi.js'
import * as chessUtils from './chessUtils.js'

const SetupPanel = ({
    turn,
    castle,
    enPassantSquare,
    halfMoveClock,
    fullMoveNumber,
    fen,
    illegal,
    analysis,
    changePiece,
    changePosition,
    changeTurn,
    changeCastle,
    changeEnPassantSquare,
    changeHalfmoveClock,
    changeFullmoveNumber,
    gameUrl
}) => {
    const onChangePiece = event => {
        changePiece(event.target.value)
    }

    const onChangeTurn = event => {
        changeTurn(event.target.value)
    }

    const onChangeCastle = event => {
        let castle =
            (document.getElementById('WKCastle').checked ? 'K' : '') +
            (document.getElementById('WQCastle').checked ? 'Q' : '') +
            (document.getElementById('BKCastle').checked ? 'k' : '') +
            (document.getElementById('BQCastle').checked ? 'q' : '')
        // Or, based on https://www.javascripttutorial.net/javascript-dom/javascript-checkbox/
        // const checkboxes = document.querySelectorAll(`input[name='castle']:checked`);
        // let castle = '';
        // checkboxes.forEach((checkbox) => {
        //     castle += checkbox.value;
        // });

        if (!castle) {
            castle = '-'
        }
        changeCastle(castle)
    }

    const onChangeHalfMoveClock = event => {
        changeHalfmoveClock(event.target.value)
    }

    const onChangeFullMoveNumber = event => {
        changeFullmoveNumber(event.target.value)
    }

    const onChangeEnPassantSquare = event => {
        changeEnPassantSquare(event.target.value)
    }

    return (
        <div className='game-info' style={{ width: '250px' }}>
            <div>
                <button onClick={() => changePosition('init')}>Init</button>
                <button onClick={() => changePosition('empty')}>Empty</button>
            </div>
            <div>
                <div onChange={onChangePiece}>
                    <input type='radio' value='K' name='piece' defaultChecked />{' '}
                    {chessUtils.pieceLookup.K}
                    <input type='radio' value='Q' name='piece' />{' '}
                    {chessUtils.pieceLookup.Q}
                    <input type='radio' value='R' name='piece' />{' '}
                    {chessUtils.pieceLookup.R}
                    <input type='radio' value='B' name='piece' />{' '}
                    {chessUtils.pieceLookup.B}
                    <input type='radio' value='N' name='piece' />{' '}
                    {chessUtils.pieceLookup.N}
                    <input type='radio' value='P' name='piece' />{' '}
                    {chessUtils.pieceLookup.P}
                </div>
                <div onChange={onChangePiece}>
                    <input type='radio' value='k' name='piece' />{' '}
                    {chessUtils.pieceLookup.k}
                    <input type='radio' value='q' name='piece' />{' '}
                    {chessUtils.pieceLookup.q}
                    <input type='radio' value='r' name='piece' />{' '}
                    {chessUtils.pieceLookup.r}
                    <input type='radio' value='b' name='piece' />{' '}
                    {chessUtils.pieceLookup.b}
                    <input type='radio' value='n' name='piece' />{' '}
                    {chessUtils.pieceLookup.n}
                    <input type='radio' value='p' name='piece' />{' '}
                    {chessUtils.pieceLookup.p}
                </div>
                <div onChange={onChangePiece}>
                    <input type='radio' value='X' name='piece' /> X
                </div>
            </div>
            <hr />
            <div>
                Turn:&nbsp;&nbsp;
                <input
                    type='radio'
                    id='WTurn'
                    value='W'
                    name='turn'
                    checked={turn === 'W'}
                    onChange={onChangeTurn}
                />{' '}
                W
                <input
                    type='radio'
                    id='BTurn'
                    value='B'
                    name='turn'
                    checked={turn === 'B'}
                    onChange={onChangeTurn}
                />{' '}
                B
                <br />
                Castle availability:
                <br />
                W:&nbsp;&nbsp;
                <input
                    type='checkbox'
                    name='castle'
                    value='K'
                    checked={castle.includes('K')}
                    id='WKCastle'
                    onChange={onChangeCastle}
                />{' '}
                O-O
                <input
                    type='checkbox'
                    name='castle'
                    value='Q'
                    checked={castle.includes('Q')}
                    id='WQCastle'
                    onChange={onChangeCastle}
                />{' '}
                O-O-O
                <br />
                B:&nbsp;&nbsp;
                <input
                    type='checkbox'
                    name='castle'
                    value='k'
                    checked={castle.includes('k')}
                    id='BKCastle'
                    onChange={onChangeCastle}
                />{' '}
                O-O
                <input
                    type='checkbox'
                    name='castle'
                    value='q'
                    checked={castle.includes('q')}
                    id='BQCastle'
                    onChange={onChangeCastle}
                />{' '}
                O-O-O
                <br />
                En passant square:&nbsp;&nbsp;
                {enPassantSquare}
                <br />
                Halfmove clock:&nbsp;&nbsp;
                <input
                    type='number'
                    onChange={onChangeHalfMoveClock}
                    min={0}
                    max={100}
                    value={halfMoveClock}
                />
                <br />
                Fullmove number:&nbsp;&nbsp;
                <input
                    type='number'
                    onChange={onChangeFullMoveNumber}
                    min={1}
                    max={999}
                    value={fullMoveNumber}
                />
            </div>
            <hr />
            <div>{fen}</div>
            <hr />
            <a href={`${gameUrl}?fen=${encodeURIComponent(fen)}`}>
                <button disabled={illegal}>Play</button>
            </a>
            <div>
                {analysis.map((item, index) => (
                    <div key={index}>{item}</div>
                ))}
            </div>
        </div>
    )
}
// <div style={{width: '80px', whiteSpace: 'nowrap'}}>
// <div style={{width: '80px'}}>
// <div>
// {encodeURIComponent(fen)}

const makeFen = (
    position,
    turn,
    castle,
    enPassantSquare,
    halfMoveClock,
    fullMoveNumber
) => {
    return chessApi.setup2Fen({
        position: position,
        turn: turn,
        castle: castle,
        enPassantSquare: enPassantSquare,
        halfMoveClock: halfMoveClock,
        fullMoveNumber: fullMoveNumber
    })
}

const checkLegalPos = (
    position,
    turn,
    castle,
    enPassantSquare,
    halfMoveClock,
    fullMoveNumber
) => {
    const illegalCheck = chessUtils.checkLegalPos(position, castle)
    // Tests that require chessAPI
    const tmpFen = makeFen(
        position,
        turn === 'B' ? 'W' : 'B',
        castle,
        enPassantSquare,
        halfMoveClock,
        fullMoveNumber
    )
    if (chessApi.inCheck(tmpFen)) {
        illegalCheck.push(
            `${
                turn === 'B' ? 'White' : 'Black'
            } is in check, but doesn't have turn.`
        )
    }
    if (JSON.stringify(chessApi.initPosition) === JSON.stringify(position)) {
        if (turn === 'B') {
            illegalCheck.push(
                "Game is in initial position, but it's black's turn."
            )
        } else if (castle !== 'KQkq' && fullMoveNumber === '1') {
            illegalCheck.push(
                'Game is in initial position, but not all castles are available.'
            )
        }
    }
    if (illegalCheck.length) {
        illegalCheck.unshift('Illegal position: ')
    }
    return illegalCheck
}

const makeAnalysis = (illegalCheck, fen) =>
    illegalCheck.length ? illegalCheck : chessApi.analyzeFen(fen)

const PositionSetup = ({ gameUrl }) => {
    const initCastle = 'KQkq'
    const emptyCastle = '-'
    const shallowDefaultPosition = chessApi.emptyPosition

    const urlSearchParams = new URLSearchParams(window.location.search)
    const params = Object.fromEntries(urlSearchParams.entries())
    const fenIn = params.fen
    if (fenIn) {
        chessApi.fen2Setup(fenIn)
    }
    const setup = fenIn
        ? chessApi.fen2Setup(fenIn)
        : {
              position: JSON.parse(JSON.stringify(shallowDefaultPosition)),
              turn: 'W',
              castle: emptyCastle,
              enPassantSquare: '-',
              halfMoveClock: '0',
              fullMoveNumber: '1'
          }

    const [piece, setPiece] = useState('K')

    const [position, setPosition] = useState(setup.position)
    const [turn, setTurn] = useState(setup.turn)
    const [castle, setCastle] = useState(setup.castle)
    const [enPassantSquare, setEnPassantSquare] = useState(
        setup.enPassantSquare
    )
    const [halfMoveClock, setHalfMoveClock] = useState(setup.halfMoveClock)
    const [fullMoveNumber, setFullMoveNumber] = useState(setup.fullMoveNumber)

    const [fen, setFen] = useState(
        makeFen(
            position,
            turn,
            castle,
            enPassantSquare,
            halfMoveClock,
            fullMoveNumber
        )
    )
    const [illegalCheck, setIllegalCheck] = useState(
        checkLegalPos(
            position,
            turn,
            castle,
            enPassantSquare,
            halfMoveClock,
            fullMoveNumber
        )
    )
    const [analysis, setAnalysis] = useState(makeAnalysis(illegalCheck, fen))

    // const highlightList = []

    const calculateBits = (
        position,
        turn,
        castle,
        enPassantSquare,
        halfMoveClock,
        fullMoveNumber
    ) => {
        const fen = makeFen(
            position,
            turn,
            castle,
            enPassantSquare,
            halfMoveClock,
            fullMoveNumber
        )
        setFen(fen)
        const illegalCheck = checkLegalPos(
            position,
            turn,
            castle,
            enPassantSquare,
            halfMoveClock,
            fullMoveNumber
        )
        setIllegalCheck(illegalCheck)
        setAnalysis(makeAnalysis(illegalCheck, fen))
    }

    const changePiece = piece => {
        const newPiece = piece === 'X' ? '' : piece
        setPiece(newPiece)
    }

    const handleClick = (_e, boardCoord) => {
        position[boardCoord.row][boardCoord.col] = piece
        setPosition([...position])
        calculateBits(
            position,
            turn,
            castle,
            enPassantSquare,
            halfMoveClock,
            fullMoveNumber
        )
    }

    const changePosition = str => {
        const defaultTurn = 'W'
        setTurn(defaultTurn)
        const [positionShallow, castle] =
            str === 'init'
                ? [chessApi.initPosition, initCastle]
                : [chessApi.emptyPosition, emptyCastle]
        const positionDeep = JSON.parse(JSON.stringify(positionShallow))
        setPosition(positionDeep)
        setCastle(castle)
        setFen(
            makeFen(
                positionDeep,
                defaultTurn,
                castle,
                enPassantSquare,
                halfMoveClock,
                fullMoveNumber
            )
        )
        calculateBits(
            positionDeep,
            defaultTurn,
            castle,
            enPassantSquare,
            halfMoveClock,
            fullMoveNumber
        )
    }

    const changeTurn = newTurn => {
        setTurn(newTurn)
        calculateBits(
            position,
            newTurn,
            castle,
            enPassantSquare,
            halfMoveClock,
            fullMoveNumber
        )
    }

    const changeCastle = castle => {
        setCastle(castle)
        calculateBits(
            position,
            turn,
            castle,
            enPassantSquare,
            halfMoveClock,
            fullMoveNumber
        )
    }

    const changeEnPassantSquare = enPassantSquare => {
        setEnPassantSquare(enPassantSquare)
        calculateBits(
            position,
            turn,
            castle,
            enPassantSquare,
            halfMoveClock,
            fullMoveNumber
        )
    }

    const changeHalfmoveClock = halfMoveClock => {
        setHalfMoveClock(halfMoveClock)
        calculateBits(
            position,
            turn,
            castle,
            enPassantSquare,
            halfMoveClock,
            fullMoveNumber
        )
    }

    const changeFullmoveNumber = fullMoveNumber => {
        setFullMoveNumber(fullMoveNumber)
        calculateBits(
            position,
            turn,
            castle,
            enPassantSquare,
            halfMoveClock,
            fullMoveNumber
        )
    }

    return (
        <div className='game'>
            <DumbBoard
                position={position}
                highlightList={[]}
                handleClick={handleClick}
            />
            <SetupPanel
                turn={turn}
                castle={castle}
                enPassantSquare={enPassantSquare}
                halfMoveClock={halfMoveClock}
                fullMoveNumber={fullMoveNumber}
                fen={fen}
                illegal={illegalCheck.length}
                analysis={analysis}
                changePiece={changePiece}
                changePosition={changePosition}
                changeTurn={changeTurn}
                changeCastle={changeCastle}
                changeEnPassantSquare={changeEnPassantSquare}
                changeHalfmoveClock={changeHalfmoveClock}
                changeFullmoveNumber={changeFullmoveNumber}
                gameUrl={gameUrl}
            />
        </div>
    )
}

export default PositionSetup
