import { useState, useEffect } from "react";
import "./index.css";

const EMOJIS = [
  "😀", "😎", "🤩", "🥳", "😇", "🤓", "🧐", "🤠",
  "😍", "🥶", "🤯", "😺", "🐶", "🦊", "🐼", "🐸",
  "🦄", "🐵", "🐱", "🐰", "🦁", "🐯", "🐨", "🐻",
  "🐷", "🐮", "🐙", "🦋", "🐢", "🐬", "🦖", "🐝",
  "🐳", "🦉", "🐌", "🐞", "🦩", "🐔", "🦓", "🐘",
  "🦒", "🍎", "🍕", "🍉", "🍓",
  "🦀", "🐧", "🦜", "🦈", "🐠", "🦥", "🦦", "🍔", "🍩"
];

// Hard: 54 pairs = 108 cards = 12 × 9 (full grid).
// Phones use fewer columns (taller grid, page scrolls) so cards stay tappable.
const DIFFICULTIES = {
  Easy: { pairs: 8, columns: 4, mobileColumns: 4, label: "Easy", size: "4 × 4", mobileSize: "4 × 4" },
  Medium: { pairs: 24, columns: 8, mobileColumns: 6, label: "Medium", size: "8 × 6", mobileSize: "6 × 8" },
  Hard: { pairs: 54, columns: 12, mobileColumns: 9, label: "Hard", size: "12 × 9", mobileSize: "9 × 12" },
};

function useIsNarrow() {
  const query = "(max-width: 639px)";
  const [narrow, setNarrow] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches
  );

  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = (e) => setNarrow(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return narrow;
}

function createDeck(level) {
  const { pairs } = DIFFICULTIES[level];
  const selectedEmojis = EMOJIS.slice(0, pairs);

  const deck = [...selectedEmojis, ...selectedEmojis].map(
    (emoji, index) => ({ id: index, emoji, matched: false })
  );

  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
}

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&display=swap');

.mg {
  --bg: #f4f0fd;
  --panel: #e8e0f8;
  --ink: #2a2147;
  --muted: #6f6590;
  --back-a: #5a46d6;
  --back-b: #7a68ee;
  --face: #ffffff;
  --match: #c6f3da;
  --match-ink: #14573b;
  --accent: #ff5d82;
  --ring: #2a2147;
  font-family: 'Bricolage Grotesque', system-ui, sans-serif;
  background: var(--bg);
  color: var(--ink);
  min-height: 100vh;
  min-height: 100dvh;
  -webkit-tap-highlight-color: transparent;
  -webkit-text-size-adjust: 100%;
}
.mg button { touch-action: manipulation; }
@media (prefers-color-scheme: dark) {
  .mg {
    --bg: #15102a;
    --panel: #201838;
    --ink: #efeaff;
    --muted: #a69dc9;
    --back-a: #6f5ce8;
    --back-b: #9486f7;
    --face: #2e2452;
    --match: #1d5944;
    --match-ink: #c9f7e0;
    --accent: #ff8aa6;
    --ring: #efeaff;
  }
}

.mg-title { font-weight: 800; letter-spacing: -0.03em; }

.mg-tray {
  background: var(--panel);
  border-radius: 1.5rem;
  padding: clamp(0.5rem, 2vw, 1.25rem);
}

.mg-seg {
  display: inline-flex;
  background: var(--panel);
  border-radius: 999px;
  padding: 0.25rem;
}
.mg-seg button {
  border-radius: 999px;
  padding: 0.4rem 0.9rem;
  font-weight: 700;
  font-size: 0.85rem;
  color: var(--muted);
  transition: background-color .2s, color .2s;
}
.mg-seg button small { font-weight: 500; opacity: .75; margin-left: .35rem; }
.mg-seg button[aria-pressed="true"] {
  background: var(--ink);
  color: var(--bg);
}

.mg-stat {
  background: var(--panel);
  border-radius: 1rem;
  padding: 0.4rem 0.9rem;
  min-width: 4.5rem;
  text-align: center;
}
.mg-stat span { display: block; font-size: 0.7rem; color: var(--muted); font-weight: 500; }
.mg-stat b { font-size: 1.15rem; font-weight: 800; font-variant-numeric: tabular-nums; }

.mg-cta {
  background: var(--accent);
  color: #fff;
  font-weight: 800;
  border-radius: 999px;
  padding: 0.55rem 1.15rem;
  transition: transform .15s;
}
.mg-cta:hover { transform: translateY(-1px); }
.mg-cta:active { transform: translateY(1px); }

/* Card flip */
.mg-card {
  perspective: 700px;
  aspect-ratio: 1 / 1;
  width: 100%;
  min-width: 0;
  border-radius: clamp(0.4rem, 1.2vw, 0.9rem);
  cursor: pointer;
}
.mg-card:disabled { cursor: default; }
.mg-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform .45s cubic-bezier(.3, .7, .25, 1);
}
.mg-card[data-revealed="true"] .mg-inner { transform: rotateY(180deg); }
.mg-face {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: inherit;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  font-size: calc(var(--cell, 3rem) * 0.5);
  line-height: 1;
}
.mg-back {
  background:
    radial-gradient(circle at 50% 50%, rgba(255,255,255,.28) 0 12%, transparent 13%),
    radial-gradient(circle at 0 0, rgba(255,255,255,.14) 0 14%, transparent 15%),
    radial-gradient(circle at 100% 100%, rgba(255,255,255,.14) 0 14%, transparent 15%),
    linear-gradient(145deg, var(--back-b), var(--back-a));
  box-shadow: 0 2px 0 rgba(0,0,0,.18);
  transition: transform .15s;
}
@media (hover: hover) {
  .mg-card:not([data-revealed="true"]):hover .mg-back { transform: translateY(-2px); }
}

@media (max-width: 639px) {
  .mg-seg { width: 100%; }
  .mg-seg button { flex: 1; padding: 0.5rem 0.25rem; }
  .mg-stats { width: 100%; }
  .mg-stat { flex: 1; min-width: 0; }
}
@media (max-width: 399px) {
  .mg-seg button small { display: none; }
}
.mg-front {
  background: var(--face);
  transform: rotateY(180deg);
  box-shadow: inset 0 0 0 2px rgba(122, 104, 238, .25);
}
.mg-card[data-matched="true"] .mg-front {
  background: var(--match);
  box-shadow: none;
}
.mg-card[data-matched="true"] .mg-front span {
  animation: mg-pop .4s cubic-bezier(.3, 1.6, .5, 1);
}
@keyframes mg-pop { 0% { transform: scale(.6); } 100% { transform: scale(1); } }

.mg button:focus-visible,
.mg-card:focus-visible { outline: 3px solid var(--ring); outline-offset: 2px; }

.mg-win {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(21, 16, 42, .55);
  backdrop-filter: blur(3px);
  padding: 1rem;
}
.mg-win > div {
  background: var(--bg);
  border-radius: 1.5rem;
  padding: 1.75rem 2rem;
  text-align: center;
  max-width: 22rem;
  animation: mg-pop .4s cubic-bezier(.3, 1.4, .5, 1);
}

@media (prefers-reduced-motion: reduce) {
  .mg-inner, .mg-back, .mg-cta { transition: none; }
  .mg-card[data-matched="true"] .mg-front span, .mg-win > div { animation: none; }
}
`;

function Card({ card, isFlipped, onClick }) {
  const revealed = isFlipped || card.matched;

  return (
    <button
      onClick={onClick}
      disabled={card.matched}
      aria-label={revealed ? card.emoji : "Hidden card"}
      className="mg-card"
      data-revealed={revealed}
      data-matched={card.matched}
    >
      <div className="mg-inner">
        <div className="mg-face mg-back" />
        <div className="mg-face mg-front">
          <span>{card.emoji}</span>
        </div>
      </div>
    </button>
  );
}

export default function App() {
  const [difficulty, setDifficulty] = useState("Easy");
  const [cards, setCards] = useState(() => createDeck("Easy"));
  const [flippedIds, setFlippedIds] = useState([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [started, setStarted] = useState(false);

  const narrow = useIsNarrow();
  const columns = narrow
    ? DIFFICULTIES[difficulty].mobileColumns
    : DIFFICULTIES[difficulty].columns;
  const totalPairs = cards.length / 2;

  const won = cards.length > 0 && cards.every((card) => card.matched);

  const matchedPairs = cards.filter((card) => card.matched).length / 2;

  // Timer.
  useEffect(() => {
    if (!started || won) return;

    const timer = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [started, won]);

  // Match checking.
  useEffect(() => {
    if (flippedIds.length !== 2) return;

    const first = cards.find((card) => card.id === flippedIds[0]);
    const second = cards.find((card) => card.id === flippedIds[1]);

    if (!first || !second) return;

    setMoves((m) => m + 1);

    if (first.emoji === second.emoji) {
      setCards((prev) =>
        prev.map((card) =>
          card.emoji === first.emoji ? { ...card, matched: true } : card
        )
      );

      setFlippedIds([]);
    } else {
      const timeout = setTimeout(() => {
        setFlippedIds([]);
      }, 800);

      return () => clearTimeout(timeout);
    }
  }, [flippedIds, cards]);

  function newGame(level = difficulty) {
    setDifficulty(level);
    setCards(createDeck(level));
    setFlippedIds([]);
    setMoves(0);
    setSeconds(0);
    setStarted(false);
  }

  function handleCardClick(card) {
    if (flippedIds.length >= 2) return;
    if (flippedIds.includes(card.id)) return;
    if (card.matched) return;

    setStarted(true);
    setFlippedIds((prev) => [...prev, card.id]);
  }

  const formattedTime =
    `${String(Math.floor(seconds / 60)).padStart(2, "0")}:` +
    `${String(seconds % 60).padStart(2, "0")}`;

  return (
    <main className="mg min-h-screen w-full overflow-auto flex flex-col gap-3 sm:gap-4 p-3 sm:p-8">
      <style>{STYLES}</style>

      {/* Header */}
      <header className="mx-auto w-full flex flex-wrap items-center justify-between gap-3" style={{ maxWidth: `${columns * 5}rem` }}>
        <div>
          <h1 className="mg-title text-3xl sm:text-5xl leading-none">
            Memory
          </h1>
          <p className="text-sm mt-2" style={{ color: "var(--muted)" }}>
            Flip two cards. Match every pair.
          </p>
        </div>

        <button onClick={() => newGame()} className="mg-cta text-sm sm:text-base">
          New game
        </button>
      </header>

      {/* Controls and statistics */}
      <section className="mx-auto w-full flex flex-wrap items-center justify-between gap-3" style={{ maxWidth: `${columns * 5}rem` }}>
        <div className="mg-seg" role="group" aria-label="Difficulty">
          {Object.entries(DIFFICULTIES).map(([key, d]) => (
            <button
              key={key}
              aria-pressed={difficulty === key}
              onClick={() => newGame(key)}
            >
              {d.label}
              <small>{narrow ? d.mobileSize : d.size}</small>
            </button>
          ))}
        </div>

        <div className="mg-stats flex gap-2">
          <div className="mg-stat">
            <span>Moves</span>
            <b>{moves}</b>
          </div>
          <div className="mg-stat">
            <span>Time</span>
            <b>{formattedTime}</b>
          </div>
          <div className="mg-stat">
            <span>Pairs</span>
            <b>{matchedPairs}/{totalPairs}</b>
          </div>
        </div>
      </section>

      {/* Board */}
      <section
        className="mg-tray grid w-full mx-auto content-start gap-1 sm:gap-2"
        style={{
          maxWidth: `${columns * 5}rem`,
          "--cell": `min(calc((100vw - 4rem) / ${columns}), 5rem)`,
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gridAutoRows: "max-content",
        }}
        aria-label={`${difficulty} memory puzzle`}
      >
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            isFlipped={flippedIds.includes(card.id)}
            onClick={() => handleCardClick(card)}
          />
        ))}
      </section>

      {/* Game result */}
      {won && (
        <div className="mg-win" role="dialog" aria-label="You won">
          <div>
            <p className="mg-title text-3xl">You won!</p>
            <p className="mt-2" style={{ color: "var(--muted)" }}>
              {moves} moves in {formattedTime}.
            </p>
            <button onClick={() => newGame()} className="mg-cta mt-5">
              Play again
            </button>
          </div>
        </div>
      )}
    </main>
  );
}