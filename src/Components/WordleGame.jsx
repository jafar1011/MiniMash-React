import { useState, useEffect } from "react";
import Button from "./Button.jsx";
import arrow from '../assets/leftarrow.png';
import "./WordleGame.css";

const WORD_LIST = [
  "react", "apple", "party", "table", "spice", "light", "stone", "flame", "crane", "grape",
  "bread", "sugar", "sweat", "brand", "cloud", "pride", "dream", "lucky", "score", "plant",
  "tiger", "mouse", "charm", "truth", "roast", "brave", "sharp", "glide", "blame", "clean",
  "grind", "storm", "drink", "flash", "climb", "blush", "chess", "piano", "truck", "ghost",
  "space", "laugh", "shiny", "zebra", "jelly", "candy", "lemon", "frost", "magic", "spoon",
  "skate", "trace", "swirl", "ocean", "siren", "night", "quiet", "serve", "vivid", "noble",
  "flare", "chill", "whale", "quack", "vague", "kiosk", "latch", "fuzzy", "blitz", "mirth",
  "thief", "scoop", "creek", "cabin", "nurse", "wrist", "giant", "elbow", "badge", "witch",
  "glory", "plaza", "unity", "vapor", "waltz", "xenon", "yield", "zesty", "bingo", "crisp",
  "daisy", "ember", "fable", "gloom", "harsh", "ivory", "jaunt", "kneel", "lunar", "mango",
  "nymph", "orbit", "pixel", "quirk", "raven", "salad", "tempo", "udder", "vigor", "wedge",
  "alien", "brisk", "clash", "dodge", "eager", "fancy", "grasp", "hoist", "infer", "jolly",
  "karma", "loyal", "novel", "oasis", "plume", "quilt", "ripen", "shard", "tweak", "unset",
  "vouch", "woven", "yacht", "zonal", "ample", "belly", "civic", "dealt", "epoch", "flood",
  "girth", "hedge", "inlet", "knack", "leech", "nerve", "optic", "punch", "quark", "retch",
  "shear", "wrath"
];

function WordleGame({ onExit }) {
  const [targetWord, setTargetWord] = useState(() =>
    WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)]
  );
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
  if (guesses.includes(targetWord)) {
    setGameOver(true);
    setMessage("🎉 You guessed it!");
    setStreak(prev => {
      const updated = prev + 1;
      localStorage.setItem("wordleStreak", updated);
      return updated;
    });
  } else if (guesses.length === 6) {
    setGameOver(true);
    setMessage(`😢 The word was "${targetWord}"`);
    setStreak(0);
    localStorage.setItem("wordleStreak", 0);
  }
}, [guesses]);

  const [streak, setStreak] = useState(() => {
  return parseInt(localStorage.getItem("wordleStreak")) || 0;
});

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver) return;

      if (e.key === "Backspace") {
        setCurrentGuess((prev) => prev.slice(0, -1));
      } else if (/^[a-zA-Z]$/.test(e.key) && currentGuess.length < 5) {
        const nextGuess = currentGuess + e.key.toLowerCase();
        setCurrentGuess(nextGuess);

        if (nextGuess.length === 5) {
          setGuesses((prev) => [...prev, nextGuess]);
          setCurrentGuess("");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentGuess, gameOver,WORD_LIST]);

  function getLetterClass(letter, index, guess) {
    if (!targetWord.includes(letter)) return "absent";
    if (targetWord[index] === letter) return "correct";
    return "present";
  }

  function handlePlayAgain() {
    setTargetWord(WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)]);
    setGuesses([]);
    setCurrentGuess("");
    setGameOver(false);
    setMessage("");
  }

  return (
    <>
      <Button
        label="Return"
        icon={arrow}
        onClick={onExit}
        style={{
          position: "absolute",
          height: "60px",
          marginTop: "30px",
        }}
        iconStyle={{
          transform: "translateY(16px)",
          width: "45px",
          marginRight: "10px",
        }}
      />

      <div className="wordle-wrapper">
        <h1>Wordle</h1>
        <div className="streak">🔥 Streak: {streak}</div>
        <div className="grid">
          {Array.from({ length: 6 }).map((_, rowIndex) => {
            const guess = guesses[rowIndex] || "";
            const isCurrentRow = rowIndex === guesses.length;

            return (
              <div key={rowIndex} className="row">
                {Array.from({ length: 5 }).map((_, i) => {
                  const letter = isCurrentRow ? currentGuess[i] : guess[i];
                  const className =
                    guess && !isCurrentRow
                      ? getLetterClass(letter, i, guess)
                      : "";

                  return (
                    <div key={i} className={`cell ${className}`}>
                      {letter || ""}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {gameOver && (
          <>
            <div className="message">{message}</div>
            <Button
              label="Play Again"
              onClick={handlePlayAgain}
              style={{
                marginTop: "-45px",width:"200px",height:"55px",
                marginLeft: "620px",
                backgroundColor: "#4caf50",
                color: "white",
                padding: "10px 20px",
                fontSize: "16px",
              }}
            />
          </>
        )}
      </div>
    </>
  );
}

export default WordleGame;
