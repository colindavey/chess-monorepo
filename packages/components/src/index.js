import React from 'react'
import styles from './styles.module.css'

// import Square from './square.js'
// export {Square}
// export { default as Square } from './square.js'
export { default as DumbBoard } from './dumbBoard.js'
export { default as Game } from './game.js'

export const ExampleComponent = ({ text }) => {
  return <div className={styles.test}>Example Component: {text}</div>
}
