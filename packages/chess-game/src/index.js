import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {Game} from 'chess-monorepo-components'

ReactDOM.render(
    <Game 
        setupUrl='https://colindavey-chess-monorepo-game.netlify.app'
    />,
    document.getElementById('root')
);

