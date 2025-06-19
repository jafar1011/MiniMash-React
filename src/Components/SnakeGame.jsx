import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import './SnakeGame.css';
import arrow from '../assets/leftarrow.png';

const GRID_SIZE = 20;

const SnakeGame = ({ onExit }) => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(
    parseInt(localStorage.getItem('snakeHighScore')) || 0
  );

  const moveRef = useRef(direction);
  const nextDirection = useRef(direction);

  useEffect(() => {
    const handleKeyDown = (e) => {
  const keyMap = {
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 },
    w: { x: 0, y: -1 },
    s: { x: 0, y: 1 },
    a: { x: -1, y: 0 },
    d: { x: 1, y: 0 },
  };

  const newDir = keyMap[e.key];
  if (!newDir) return;

  e.preventDefault();

  const current = moveRef.current;

  // Ignore opposite directions
  const isOpposite =
    current.x === -newDir.x && current.y === -newDir.y;

  if (!isOpposite) {
    nextDirection.current = newDir;
  }
};

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSnake(prevSnake => {
        
        moveRef.current = nextDirection.current;

        const head = {
      x: prevSnake[0].x + moveRef.current.x,
      y: prevSnake[0].y + moveRef.current.y,
    };

        if (
          head.x < 0 || head.y < 0 ||
          head.x >= GRID_SIZE || head.y >= GRID_SIZE ||
          prevSnake.some(seg => seg.x === head.x && seg.y === head.y)
        ) {
          if (score > highScore) {
            localStorage.setItem('snakeHighScore', score);
            setHighScore(score);
          }
          setScore(0);
          setDirection({ x: 0, y: 0 });
          moveRef.current = { x: 0, y: 0 };
          nextDirection.current = { x: 0, y: 0 };
          return [{ x: 10, y: 10 }];
        }

        const newSnake = [head, ...prevSnake];

        if (head.x === food.x && head.y === food.y) {
          setScore(prev => prev + 1);
          setFood({
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE),
          });
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [food, score, highScore]);

  const navigate = useNavigate();

  return (
    <>
      <Button
        label="Return"
        icon={arrow}
        onClick={onExit}
        style={{ position: 'absolute', height: "60px", marginTop: '30px' }}
        iconStyle={{ transform: 'translateY(16px)', width: "45px", marginRight: "10px" }}
      />
      <div className="snake-game-wrapper">
        <div className="scoreboard">
          <div>Score: {score}</div>
          <div>&nbsp;&nbsp;&nbsp;High Score: {highScore}</div>
        </div>

        <div className="snake-game-grid">
          {Array.from({ length: GRID_SIZE }).map((_, row) => (
            <div key={row} className="snake-row">
              {Array.from({ length: GRID_SIZE }).map((_, col) => {
                const isHead = snake[0].x === col && snake[0].y === row;
                const isBody = snake.some(seg => seg.x === col && seg.y === row);
                const isFood = food.x === col && food.y === row;

                return (
                  <div
                    key={col}
                    className={`snake-cell ${
                      isHead ? 'snake-head' :
                      isBody ? 'snake-body' :
                      isFood ? 'food' : ''
                    }`}
                  >
                    {isHead && (
                      <>
                        <div className="eye eye-left" />
                        <div className="eye eye-right" />
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SnakeGame;
