import React, { useState } from 'react'
import ReactDOM from 'react-dom';
import './index.css';
import { DumbBoard } from 'components'
import * as chessApi from 'components'
import * as chessUtils from 'components'

const SetupPanel = ({ changePiece, changePosition, changeTurn, turn }) => {

    const onChangePiece = (event) => {
        changePiece(event.target.value)
    }

    const onChangeTurn = (event) => {
        changeTurn(event.target.value)
    }

    return (
        <div className='game-info' style={{'border':'solid'}}>
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
            <div onChange={onChangeTurn}>
                Turn: 
                <input type='radio' value='W' name='turn' defaultChecked={true}/> W
                <input type='radio' value='B' name='turn' /> B
            </div>
            <div onChange={onChangeTurn}>
                W: 
                <input type='checkbox' value='K' name='turn'/> O-O
                <input type='checkbox' value='Q' name='turn' /> O-O-O
                <br/>
                B: 
                <input type='checkbox' value='k' name='turn'/> O-O
                <input type='checkbox' value='q' name='turn' /> O-O-O
            </div>
        </div>
    )
}

const FenPanel = ({ position, turn }) => {
    return (
        <div style={{'border':'solid'}}>
            {position}
            {turn}
        </div>
    )
}

const PositionSetup = () => {
    const initGameState = chessApi.init()
    const initPosition = initGameState.position
    const emptyGameState = chessApi.empty()
    const emptyPosition = emptyGameState.position
    const [position, setPosition] = useState(emptyPosition)
    const [piece, setPiece] = useState('K')
    const [turn, setTurn] = useState('W')

    // const highlightList = []

    const handleClick = boardCoord => {
        position[boardCoord.row][boardCoord.col] = piece
        setPosition([...position])
    }

    const changePiece = piece => {
        const newPiece = piece === 'X' ? '' : piece
        setPiece(newPiece)
    }

    const changePosition = str => {
        console.log(str)
        if (str === 'init') {
            setPosition(initPosition)            
        } else {
            setPosition(chessApi.emptyPosition)            
        }
    }

    const changeTurn = newTurn => {
        setTurn(newTurn)
    }

    return (
        <div className='game'>
            <DumbBoard
                position={position}
                highlightList={[]}
                handleClick={handleClick}
            />
            <SetupPanel
                changePosition={changePosition}
                changePiece={changePiece}
                changeTurn={changeTurn}
                turn={turn}
            />
            <FenPanel
                position={position}
                turn={turn}
            />
        </div>
    )
}

ReactDOM.render(
    <PositionSetup/>,
    document.getElementById('root')
);
