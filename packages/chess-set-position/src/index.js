import React, { useState } from 'react'
import ReactDOM from 'react-dom';
import './index.css';
import { DumbBoard } from 'components'
import * as chessApi from 'components'
import * as chessUtils from 'components'

const SetupPanel = ({ turn, castle, enPassantSquare, halfMoveClock, fullMoveNumber, fen, analysis, changePiece, changePosition, changeTurn, changeCastle }) => {

    const onChangePiece = (event) => {
        changePiece(event.target.value)
    }

    const onChangeTurn = (event) => {
        changeTurn(event.target.value)
    }

    const onChangeCastle = (event) => {
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
    
    // style={{'border':'solid'}}

    return (
        <div className='game-info' style={{width: '250px'}}>
            <div>
               <button onClick={() => changePosition('init')}>Init</button>
               <button onClick={() => changePosition('empty')}>Empty</button>
            </div>
            <div>
                <div onChange={onChangePiece}>
                    <input type='radio' value='K' name='piece' defaultChecked={true}/> {chessUtils.pieceLookup['K']}
                    <input type='radio' value='Q' name='piece' /> {chessUtils.pieceLookup['Q']}
                    <input type='radio' value='R' name='piece' /> {chessUtils.pieceLookup['R']}
                    <input type='radio' value='B' name='piece' /> {chessUtils.pieceLookup['B']}
                    <input type='radio' value='N' name='piece' /> {chessUtils.pieceLookup['N']}
                    <input type='radio' value='P' name='piece' /> {chessUtils.pieceLookup['P']}
                </div>
                <div onChange={onChangePiece}>
                    <input type='radio' value='k' name='piece' /> {chessUtils.pieceLookup['k']}
                    <input type='radio' value='q' name='piece' /> {chessUtils.pieceLookup['q']}
                    <input type='radio' value='r' name='piece' /> {chessUtils.pieceLookup['r']}
                    <input type='radio' value='b' name='piece' /> {chessUtils.pieceLookup['b']}
                    <input type='radio' value='n' name='piece' /> {chessUtils.pieceLookup['n']}
                    <input type='radio' value='p' name='piece' /> {chessUtils.pieceLookup['p']}
                </div>
                <div onChange={onChangePiece}>
                    <input type='radio' value='X' name='piece' /> X
                </div>
            </div>
            <hr/>
            <div>
                Turn:
                <input type='radio' id='WTurn' value='W' name='turn' checked={turn === 'W'} onChange={onChangeTurn}/> W
                <input type='radio' id='BTurn' value='B' name='turn' checked={turn === 'B'} onChange={onChangeTurn}/> B
                <br/>
                Castle availability:<br/>
                W:
                <input type='checkbox' name='castle' value='K' checked={castle.includes('K')} id='WKCastle' onChange={onChangeCastle}/> O-O
                <input type='checkbox' name='castle' value='Q' checked={castle.includes('Q')} id='WQCastle' onChange={onChangeCastle}/> O-O-O
                <br/>
                B:
                <input type='checkbox' name='castle' value='k' checked={castle.includes('k')} id='BKCastle' onChange={onChangeCastle}/> O-O
                <input type='checkbox' name='castle' value='q' checked={castle.includes('q')} id='BQCastle' onChange={onChangeCastle}/> O-O-O
                <br/>
                Halfmove clock: 
                {halfMoveClock}
                <br/>
                Fullmove number: 
                {fullMoveNumber}
                <br/>
                En passant square: 
                {enPassantSquare}
            </div>
           <hr/>
            <div>
                {fen}
            </div>
            <hr/>
            <div>
                {analysis.map((item, index) => <div key={index}>{item}</div>)}
            </div>
        </div>
    )
}
// <div style={{width: '80px', whiteSpace: 'nowrap'}}>
// <div style={{width: '80px'}}>
// <div>

const makeFen = (position, turn, castle, enPassantSquare, halfMoveClock, fullMoveNumber) => {
    return chessApi.setup2Fen({ position: position, turn: turn, castle: castle, enPassantSquare: enPassantSquare, halfMoveClock: halfMoveClock, fullMoveNumber: fullMoveNumber })
}

const makeAnalysis = (position, turn, castle, enPassantSquare, halfMoveClock, fullMoveNumber, fen) => {
    const illegalCheck = chessUtils.checkLegalPos(position)
    // Tests that require chessAPI
    const tmpFen = makeFen(position, turn === 'B' ? 'W' : 'B', castle, enPassantSquare, halfMoveClock, fullMoveNumber)
    if (chessApi.inCheck(tmpFen)) {
        illegalCheck.push(`${turn === 'B' ? 'White' : 'Black'} is in check, but doesn't have turn.`)
    }
    if (JSON.stringify(chessApi.initPosition) === JSON.stringify(position)) {
        if (turn === 'B') {
            illegalCheck.push("Game is in initial position, but it's black's turn.")
        } else if (castle !== 'KQkq' && fullMoveNumber === '1') {
            illegalCheck.push("Game is in initial position, but not all castles are available.")
        }
    }
    if (illegalCheck.length) {
        illegalCheck.unshift('Illegal position: ')
    }
    return illegalCheck.length ? illegalCheck : chessApi.analyzeFen(fen)
}

const PositionSetup = () => {
    const initCastle = 'KQkq'
    const emptyCastle = '-'

    const [piece, setPiece] = useState('K')

    const [position, setPosition] = useState(chessApi.emptyPosition)
    const [turn, setTurn] = useState('W')
    const [castle, setCastle] = useState(emptyCastle)

    const [enPassantSquare, setEnPassantSquare] = useState('-')
    const [halfMoveClock, setHalfMoveClock] = useState('0')
    const [fullMoveNumber, setFullMoveNumber] = useState('1')
    // enPassantSquare: '-', halfMoveClock: '0', fullMoveNumber: '1'

    const [fen, setFen] = useState(makeFen(position, turn, castle, enPassantSquare, halfMoveClock, fullMoveNumber))
    const [analysis, setAnalysis] = useState(makeAnalysis(position, turn, castle, enPassantSquare, halfMoveClock, fullMoveNumber, fen))
    
    // const highlightList = []

    const calculateBits = (position, turn, castle, enPassantSquare, halfMoveClock, fullMoveNumber) => {
        const fen = makeFen(position, turn, castle, enPassantSquare, halfMoveClock, fullMoveNumber)
        setFen(fen)
        setAnalysis(makeAnalysis(position, turn, castle, enPassantSquare, halfMoveClock, fullMoveNumber, fen))
    }

    const changePiece = piece => {
        const newPiece = piece === 'X' ? '' : piece
        setPiece(newPiece)
    }

    const handleClick = boardCoord => {
        position[boardCoord.row][boardCoord.col] = piece
        setPosition([...position])
        calculateBits(position, turn, castle, enPassantSquare, halfMoveClock, fullMoveNumber)
    }

    const changePosition = str => {
        const defaultTurn = 'W'
        setTurn(defaultTurn)
        if (str === 'init') {
            setPosition(chessApi.initPosition)
            setCastle(initCastle)
            setFen(makeFen(chessApi.initPosition, defaultTurn, initCastle, enPassantSquare, halfMoveClock, fullMoveNumber))
            calculateBits(chessApi.initPosition, defaultTurn, initCastle, enPassantSquare, halfMoveClock, fullMoveNumber)
        } else {
            setPosition(chessApi.emptyPosition)            
            setCastle(emptyCastle)
            setFen(makeFen(chessApi.emptyPosition, defaultTurn, emptyCastle, enPassantSquare, halfMoveClock, fullMoveNumber))
            calculateBits(chessApi.emptyPosition, defaultTurn, emptyCastle, enPassantSquare, halfMoveClock, fullMoveNumber)
        }
    }

    const changeTurn = newTurn => {
        setTurn(newTurn)
        calculateBits(position, newTurn, castle, enPassantSquare, halfMoveClock, fullMoveNumber)
    }

    const changeCastle = castle => {
        setCastle(castle)
        calculateBits(position, turn, castle, enPassantSquare, halfMoveClock, fullMoveNumber)
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
                analysis={analysis}
                changePiece={changePiece}
                changePosition={changePosition}
                changeTurn={changeTurn}
                changeCastle={changeCastle}
            />
        </div>
    )
}

ReactDOM.render(
    <PositionSetup/>,
    document.getElementById('root')
);
