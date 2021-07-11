import React, { useState } from 'react'
import ReactDOM from 'react-dom';
import './index.css';
import { DumbBoard } from 'components'
import * as chessApi from 'components'
import * as chessUtils from 'components'

const SetupPanel = ({ changePiece, changePosition, changeTurn, changeCastle, turn, castle, fen, analysis}) => {

    
    const onChangePiece = (event) => {
        changePiece(event.target.value)
    }

    const onChangeTurn = (event) => {
        changeTurn(event.target.value)
    }

    const onChangeCastle = (event) => {
        console.log('onChangeCastle', document.getElementById('WKCastle').checked)
        const castle = 
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
        // if (!castle) {
        //     castle = '-'
        // }
        console.log('castle', castle)
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
            </div>
            <div>
                W: 
                <input type='checkbox' name='castle' value='K' checked={castle.includes('K')} id='WKCastle' onChange={onChangeCastle}/> O-O
                <input type='checkbox' name='castle' value='Q' checked={castle.includes('Q')} id='WQCastle' onChange={onChangeCastle}/> O-O-O
                <br/>
                B: 
                <input type='checkbox' name='castle' value='k' checked={castle.includes('k')} id='BKCastle' onChange={onChangeCastle}/> O-O
                <input type='checkbox' name='castle' value='q' checked={castle.includes('q')} id='BQCastle' onChange={onChangeCastle}/> O-O-O
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

const makeFen = (position, turn, castle) => {
    return chessApi.setup2Fen({ position: position, turn: turn, castle: castle, enPassantSquare: '-', halfMoveClock: '0', fullMoveNumber: '1' })
}

const PositionSetup = () => {
    const initGameState = chessApi.init()
    const initPosition = initGameState.position
    const initCastle = 'KQkq'
    const emptyGameState = chessApi.empty()
    const emptyPosition = emptyGameState.position
    const emptyCastle = '-'

    const [piece, setPiece] = useState('K')

    const [position, setPosition] = useState(emptyPosition)
    const [turn, setTurn] = useState('W')
    const [castle, setCastle] = useState(emptyCastle)

    const [fen, setFen] = useState(makeFen(position, turn, castle))
    const illegalCheck = chessUtils.checkLegalPos(position)
    const [analysis, setAnalysis] = useState(illegalCheck.length ? illegalCheck : chessApi.analyzeFen(fen))
    
    // const highlightList = []

    const calculateBits = (position, turn, castle) => {
        const fen = makeFen(position, turn, castle)
        setFen(fen)
        const illegalCheck = chessUtils.checkLegalPos(position)
        // TODO: following line duplicates the analysis state code above
        const analysis = illegalCheck.length ? illegalCheck : chessApi.analyzeFen(fen)
        setAnalysis(analysis)
    }

    const changePiece = piece => {
        const newPiece = piece === 'X' ? '' : piece
        setPiece(newPiece)
    }

    const handleClick = boardCoord => {
        position[boardCoord.row][boardCoord.col] = piece
        setPosition([...position])
        // setFen(makeFen(position, turn, castle))
        calculateBits(position, turn, castle)
    }

    const changePosition = str => {
        const defaultTurn = 'W'
        setTurn(defaultTurn)
        if (str === 'init') {
            setPosition(initPosition)
            setCastle(initCastle)
            setFen(makeFen(initPosition, defaultTurn, initCastle))
            calculateBits(initPosition, defaultTurn, initCastle)
        } else {
            setPosition(chessApi.emptyPosition)            
            setCastle(emptyCastle)
            setFen(makeFen(chessApi.emptyPosition, defaultTurn, emptyCastle))
            calculateBits(chessApi.emptyPosition, defaultTurn, emptyCastle)
        }
    }

    const changeTurn = newTurn => {
        setTurn(newTurn)
        // setFen(makeFen(position, turn, castle))
        calculateBits(position, newTurn, castle)
    }

    const changeCastle = castle => {
        setCastle(castle)
        // setFen(makeFen(position, turn, castle))
        calculateBits(position, turn, castle)
    }

    return (
        <div className='game'>
            <DumbBoard
                position={position}
                highlightList={[]}
                handleClick={handleClick}
            />
            <SetupPanel
                changePiece={changePiece}
                changePosition={changePosition}
                changeTurn={changeTurn}
                changeCastle={changeCastle}
                turn={turn}
                castle={castle}
                fen={fen}
                analysis={analysis}
            />
        </div>
    )
}

ReactDOM.render(
    <PositionSetup/>,
    document.getElementById('root')
);
