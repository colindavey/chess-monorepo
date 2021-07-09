import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {Game} from 'components'
import * as chessApi from 'components'

console.log('empty', chessApi.emptyPosition)
ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

