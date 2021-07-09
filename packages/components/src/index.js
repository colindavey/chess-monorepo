import React from 'react'
import styles from './styles.module.css'

export { default as DumbBoard } from './dumbBoard.js'
export { default as Game } from './game.js'
export * from './chessApi.js'

export const ExampleComponent = ({ text }) => {
    return <div className={styles.test}>Example Component: {text}</div>
}
