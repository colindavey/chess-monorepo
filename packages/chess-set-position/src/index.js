import React, { useState } from 'react'
import ReactDOM from 'react-dom';
import './index.css';
import { DumbBoard } from 'components'
import * as chessApi from 'components'
import * as chessUtils from 'components'

// const SetupPanel = ({ moves, currentMoveNum, handleListingClick }) => {
const SetupPanel = ({ changePiece, changePosition}) => {
    const onChangeValue = (event) => {
        console.log(event.target.value);
        changePiece(event.target.value)
    }

    return (
        <div className='game-info' style={{'border':'solid'}}>
            <div>
               <button>Init</button>
               <button>Empty</button>
            </div>
            <div onChange={onChangeValue}>
                <input type='radio' value='K' name='piece' /> {chessUtils.pieceLookup['K']}
                <input type='radio' value='Q' name='piece' /> {chessUtils.pieceLookup['Q']}
                <input type='radio' value='R' name='piece' /> {chessUtils.pieceLookup['R']}
                <input type='radio' value='B' name='piece' /> {chessUtils.pieceLookup['B']}
                <input type='radio' value='N' name='piece' /> {chessUtils.pieceLookup['N']}
                <input type='radio' value='P' name='piece' /> {chessUtils.pieceLookup['P']}
            </div>
            <div onChange={onChangeValue}>
                <input type='radio' value='k' name='piece' /> {chessUtils.pieceLookup['k']}
                <input type='radio' value='q' name='piece' /> {chessUtils.pieceLookup['q']}
                <input type='radio' value='r' name='piece' /> {chessUtils.pieceLookup['r']}
                <input type='radio' value='b' name='piece' /> {chessUtils.pieceLookup['b']}
                <input type='radio' value='n' name='piece' /> {chessUtils.pieceLookup['n']}
                <input type='radio' value='p' name='piece' /> {chessUtils.pieceLookup['p']}
            </div>
            <div onChange={onChangeValue}>
                <input type='radio' value='X' name='piece' /> X
            </div>
        </div>
    )
}

const PositionSetup = () => {
    // const initGameState = chessApi.init()
    // const [position, setPosition] = useState(initGameState.position)
    const [position, setPosition] = useState(chessApi.emptyPosition)
    const [piece, setPiece] = useState('K')

    // const highlightList = []

    const handleClick = boardCoord => {
        position[boardCoord.row][boardCoord.col] = piece
        setPosition([...position])
    }

    const changePiece = piece => {
        const newPiece = piece === 'X' ? '' : piece
        setPiece(newPiece)
    }

    const changePosition = boardCoord => {

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
            />
        </div>
    )
}

ReactDOM.render(
    <PositionSetup/>,
    document.getElementById('root')
);
