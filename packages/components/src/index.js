import React from 'react'
import styles from './styles.module.css'

// import Square from './square.js'
// export {Square}
export { default as Square } from './square.js'

export const ExampleComponent = ({ text }) => {
  return <div className={styles.test}>Example Component: {text}</div>
}
