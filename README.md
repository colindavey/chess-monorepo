# chess-monorepo
To use, after cloning, from root directory run 
```
yarn install
lerna bootstrap
```

Then, to run the Game app,
```
cd packages/chess-game
yarn start
```
<img src="https://github.com/colindavey/chess-monorepo/blob/master/images/mono-game.png" width="200"/>

To run the Position-setup app,
```
cd packages/chess-set-position
yarn start
```
<img src="https://github.com/colindavey/chess-monorepo/blob/master/images/mono-setup.png" width="200"/>

To run the simple Board-clicker app (just logs to the console the square that you clicked),
```
cd packages/chess-board-clicker
yarn start
```
<img src="https://github.com/colindavey/chess-monorepo/blob/master/images/mono-clicker.png" width="200"/>
