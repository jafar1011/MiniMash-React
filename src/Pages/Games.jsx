import { useState, useEffect } from 'react';
import Header from '../Components/Header.jsx';
//snakegame
import SnakeGame from '../Components/SnakeGame.jsx';
import Button from '../Components/Button.jsx';
import snakeimg from '../assets/snake.png';
//wordle
import wordle from '../assets/wordle.png'
import WordleGame from '../Components/WordleGame.jsx';
//tetris
import tetrisimg from '../assets/tetris.png'
import TetrisGame from '../Components/TetrisGame.jsx'


function Games() {
  const [selectedGame, setSelectedGame] = useState(null);
  useEffect(() => {
    document.title = "Mini Mash - Games";
  }, []);

  return (
    <>
      <Header />


      {!selectedGame && (
        <div className="game-menu">
          <Button
            label="Snake Game"
            icon={snakeimg}
            onClick={() => setSelectedGame("snake")}
          />
          <Button
            label="Wordle"
            icon={wordle}
            onClick={() => setSelectedGame("wordle")}
            style={{ height: "120px", display: "flex", marginTop: "-122px", marginLeft: "400px" }}
            iconStyle={{ marginTop: "35px" }}
          />
          <Button label="Tetris"
            icon={tetrisimg}
            onClick={() => setSelectedGame("tetris")}
            style={{ height: "90px" }}
            iconStyle={{ marginTop: "25px" }}
          />
          <p style={{ color: "#3ea743", marginLeft: "400px", marginTop: "-50px", }}>More to be added soon...</p>
        </div>
      )}

      {selectedGame === "snake" && <SnakeGame onExit={() => setSelectedGame(null)} />}
      {selectedGame === "wordle" && <WordleGame onExit={() => setSelectedGame(null)} />}
      {selectedGame === "tetris" && <TetrisGame onExit={() => setSelectedGame(null)} />}





    </>
  );
}

export default Games;
