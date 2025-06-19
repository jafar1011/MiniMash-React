import React, { useState, useEffect, useRef } from "react";
import styles from "./TetrisGame.module.css";
import Button from './Button.jsx';
import arrow from '../assets/leftarrow.png';

const ROWS = 20;
const COLS = 10;
const EMPTY = 0;

const TETROMINOES = {
    I: [[1, 1, 1, 1]],
    O: [
        [2, 2],
        [2, 2],
    ],
    T: [
        [0, 3, 0],
        [3, 3, 3],
    ],
    S: [
        [0, 4, 4],
        [4, 4, 0],
    ],
    Z: [
        [5, 5, 0],
        [0, 5, 5],
    ],
    J: [
        [6, 0, 0],
        [6, 6, 6],
    ],
    L: [
        [0, 0, 7],
        [7, 7, 7],
    ],
};

const getRandomTetromino = () => {
    const keys = Object.keys(TETROMINOES);
    const shape = keys[Math.floor(Math.random() * keys.length)];
    return {
        shape,
        matrix: TETROMINOES[shape],
        row: 0,
        col: Math.floor((COLS - TETROMINOES[shape][0].length) / 2),
    };
};

const createEmptyBoard = () =>
    Array.from({ length: ROWS }, () => Array(COLS).fill(EMPTY));

const rotate = (matrix) =>
    matrix[0].map((_, i) => matrix.map((row) => row[i]).reverse());

const Tetris = ({ onExit }) => {
    const [board, setBoard] = useState(createEmptyBoard());
    const [current, setCurrent] = useState(getRandomTetromino());
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [linesCleared, setLinesCleared] = useState(0);
    const [level, setLevel] = useState(1);

    const dropIntervalRef = useRef(null);
    const keysPressed = useRef({ ArrowLeft: false, ArrowRight: false, ArrowDown: false });
    const lastHorizontalMoveTime = useRef(0);

    const isValidMove = (matrix, row, col) =>
        matrix.every((r, i) =>
            r.every((val, j) => {
                const newRow = row + i;
                const newCol = col + j;
                return (
                    !val ||
                    (newRow >= 0 &&
                        newRow < ROWS &&
                        newCol >= 0 &&
                        newCol < COLS &&
                        board[newRow][newCol] === EMPTY)
                );
            })
        );

    const lockPiece = (piece) => {
        const newBoard = board.map((row) => [...row]);
        piece.matrix.forEach((row, r) => {
            row.forEach((val, c) => {
                if (val && piece.row + r >= 0) {
                    newBoard[piece.row + r][piece.col + c] = val;
                }
            });
        });

        const filtered = newBoard.filter((row) => row.some((cell) => cell === EMPTY));
        const clearedRows = ROWS - filtered.length;
        while (filtered.length < ROWS) filtered.unshift(Array(COLS).fill(EMPTY));

        setBoard(filtered);

        if (clearedRows > 0) {
            setLinesCleared((prev) => prev + clearedRows);
            setScore((prev) => prev + clearedRows * 100 * level);
            setLevel((prevLevel) => {
                const totalLines = linesCleared + clearedRows;
                return totalLines % 10 === 0 ? prevLevel + 1 : prevLevel;
            });
        }
    };

    const spawnNextPiece = () => {
        const next = getRandomTetromino();
        if (!isValidMove(next.matrix, next.row, next.col)) {
            setGameOver(true);
            clearInterval(dropIntervalRef.current);
            return null;
        }
        return next;
    };

    const moveDown = () => {
        setCurrent((prev) => {
            const newRow = prev.row + 1;
            if (isValidMove(prev.matrix, newRow, prev.col)) {
                return { ...prev, row: newRow };
            } else {
                lockPiece(prev);
                const nextPiece = spawnNextPiece();
                return nextPiece || prev;
            }
        });
    };

    const BASE_SPEED = 500;
    const SOFT_DROP_SPEED = 50;

    const getDropSpeed = () => Math.max(100, BASE_SPEED - (level - 1) * 50);

    useEffect(() => {
        if (gameOver) return;
        clearInterval(dropIntervalRef.current);
        dropIntervalRef.current = setInterval(moveDown, getDropSpeed());

        return () => clearInterval(dropIntervalRef.current);
    }, [board, gameOver, level, linesCleared]);

    const handleHorizontalMove = (direction) => {
        const now = performance.now();
        if (now - lastHorizontalMoveTime.current < 150) return;

        setCurrent((prev) => {
            const newCol = prev.col + direction;
            if (isValidMove(prev.matrix, prev.row, newCol)) {
                lastHorizontalMoveTime.current = now;
                return { ...prev, col: newCol };
            }
            return prev;
        });
    };

    useEffect(() => {
        if (gameOver) return;

        let horizontalMoveInterval = null;

        const onKeyDown = (e) => {
            if (keysPressed.current[e.key]) return;

            if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
                keysPressed.current[e.key] = true;
                handleHorizontalMove(e.key === "ArrowLeft" ? -1 : 1);
                horizontalMoveInterval = setInterval(() => {
                    handleHorizontalMove(e.key === "ArrowLeft" ? -1 : 1);
                }, 150);
            } else if (e.key === "ArrowDown") {
                keysPressed.current.ArrowDown = true;
                clearInterval(dropIntervalRef.current);
                dropIntervalRef.current = setInterval(moveDown, SOFT_DROP_SPEED);
            } else if (e.key === "r" || e.key === "R") {
                setCurrent((prev) => {
                    const rotated = rotate(prev.matrix);
                    return isValidMove(rotated, prev.row, prev.col) ? { ...prev, matrix: rotated } : prev;
                });
            }
        };

        const onKeyUp = (e) => {
            if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
                keysPressed.current[e.key] = false;
                if (
                    !keysPressed.current.ArrowLeft &&
                    !keysPressed.current.ArrowRight &&
                    horizontalMoveInterval
                ) {
                    clearInterval(horizontalMoveInterval);
                    horizontalMoveInterval = null;
                }
            } else if (e.key === "ArrowDown") {
                keysPressed.current.ArrowDown = false;
                clearInterval(dropIntervalRef.current);
                dropIntervalRef.current = setInterval(moveDown, getDropSpeed());
            }
        };

        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("keyup", onKeyUp);

        return () => {
            window.removeEventListener("keydown", onKeyDown);
            window.removeEventListener("keyup", onKeyUp);
            if (horizontalMoveInterval) clearInterval(horizontalMoveInterval);
            clearInterval(dropIntervalRef.current);
        };
    }, [board, gameOver, level, linesCleared]);

    const handlePlayAgain = () => {
        setBoard(createEmptyBoard());
        setCurrent(getRandomTetromino());
        setGameOver(false);
        setScore(0);
        setLinesCleared(0);
        setLevel(1);
    };

    const mergedBoard = board.map((row) => [...row]);
    current.matrix.forEach((row, r) => {
        row.forEach((val, c) => {
            if (val && current.row + r >= 0) {
                mergedBoard[current.row + r][current.col + c] = val;
            }
        });
    });

    return (
        <>
            <Button
                label="Return"
                icon={arrow}
                onClick={onExit}
                style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    height: '60px',
                    fontSize: '18px'
                }}
                iconStyle={{ transform: 'translateY(10px)', width: '30px', marginRight: '10px' }}
            />

            <div className={styles.container}>
                <h1 className={styles.title}>Tetris</h1>

                <div className={styles.stats}>
                    <div>Score: {score}</div>
                    <div>Lines: {linesCleared}</div>
                    <div>Level: {level}</div>
                </div>

                {gameOver && <div className={styles.gameOver}>Game Over</div>}
                {gameOver && (
                    <Button
                        label="Play Again"
                        onClick={handlePlayAgain}
                        style={{
                            marginTop: "330px", marginLeft: "630px", position: "absolute",
                            width: "200px",
                            height: "55px",
                            backgroundColor: "#4caf50",
                            color: "white",
                            padding: "10px 20px",
                            fontSize: "16px",
                        }}
                    />
                )}

                <div
                    className={styles.board}
                    style={{
                        gridTemplateRows: `repeat(${ROWS}, 20px)`,
                        gridTemplateColumns: `repeat(${COLS}, 20px)`,
                    }}
                >
                    {mergedBoard.flat().map((cell, i) => (
                        <div
                            key={i}
                            className={`${styles.cell} ${cell ? styles[`color${cell}`] : styles.empty}`}
                        />
                    ))}
                </div>

                <div className={styles.controls}>
                    <p>Use ← → (hold) to move slowly, ↓ (hold) to soft drop, R to rotate</p>
                </div>
            </div>
        </>
    );
};

export default Tetris;
