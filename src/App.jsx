import { useState, useEffect } from "react";
import "./index.css"; // this file contains the Tailwind import

const EMOJIS = ["🐶", "🐱", "🦊", "🐸", "🐼", "🦁", "🐵", "🐙"];

// Make a fresh shuffled deck of 16 cards
function createDeck() {
  const deck = [...EMOJIS, ...EMOJIS].map((emoji, index) => ({
    id: index,
    emoji: emoji,
    matched: false,
  }));
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

// One card. The Tailwind classes change depending on its state.
function Card({ card, isFlipped, onClick }) {
  const base =
    "aspect-square rounded-xl text-4xl transition active:scale-95 cursor-pointer";

  let look = "bg-indigo-500 text-transparent"; // face down
  if (card.matched) {
    look = "bg-green-200 dark:bg-green-800 cursor-default"; // found
  } else if (isFlipped) {
    look = "bg-white dark:bg-slate-700"; // face up
  }

  return (
    <button className={`${base} ${look}`} onClick={onClick}>
      {card.emoji}
    </button>
  );
}

export default function App() {
  const [cards, setCards] = useState(createDeck);
  const [flippedIds, setFlippedIds] = useState([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [started, setStarted] = useState(false);

  const won = cards.every((c) => c.matched);

  // Timer: runs only while the game is started and not won
  useEffect(() => {
    if (!started || won) return;
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [started, won]);

  // When two cards are flipped, check if they match
  useEffect(() => {
    if (flippedIds.length !== 2) return;

    setMoves((m) => m + 1);
    const [first, second] = flippedIds.map((id) => cards.find((c) => c.id === id));

    if (first.emoji === second.emoji) {
      setCards((prev) =>
        prev.map((c) => (c.emoji === first.emoji ? { ...c, matched: true } : c))
      );
      setFlippedIds([]);
    } else {
      const timeout = setTimeout(() => setFlippedIds([]), 800);
      return () => clearTimeout(timeout);
    }
  }, [flippedIds]);

  function handleCardClick(card) {
    if (flippedIds.length === 2) return;
    if (flippedIds.includes(card.id)) return;
    if (card.matched) return;

    setStarted(true);
    setFlippedIds([...flippedIds, card.id]);
  }

  function newGame() {
    setCards(createDeck());
    setFlippedIds([]);
    setMoves(0);
    setSeconds(0);
    setStarted(false);
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-3 py-5 bg-violet-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <h1 className="text-2xl font-bold mb-3">🧠 Memory Game</h1>

      <div className="flex gap-5 mb-4 text-lg">
        <span>Moves: <b>{moves}</b></span>
        <span>Time: <b>{seconds}</b>s</span>
      </div>

      <div className="grid grid-cols-4 gap-2.5 w-full max-w-sm">
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            isFlipped={flippedIds.includes(card.id)}
            onClick={() => handleCardClick(card)}
          />
        ))}
      </div>

      <div className="min-h-6 my-4 font-semibold">
        {won && `🎉 You won in ${moves} moves and ${seconds} seconds!`}
      </div>

      <button
        onClick={newGame}
        className="bg-indigo-500 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-600 cursor-pointer"
      >
        New Game
      </button>
    </div>
  );
}