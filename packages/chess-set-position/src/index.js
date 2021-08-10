import React from 'react'
import ReactDOM from 'react-dom';
import './index.css';
import {PositionSetup} from 'chess-monorepo-components'

ReactDOM.render(
    <PositionSetup
        gameUrl='https://colindavey-chess-monorepo-game.netlify.app'
    />,
    document.getElementById('root')
);
