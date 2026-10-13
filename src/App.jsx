import {useState, useEffect} from 'react'
import "./index.css"

const EMOJIS = ["😀", "😎", "🤩", "🥳", "😇", "🤓", "🧐", "🤠"];

function createDeck(){
  const deck = [...EMOJIS, ...EMOJIS].map((emoji, index) => ({
    id: index,
    emoji: emoji,
    matched: false,
  }));
  for(let i = deck.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() *(i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function Card({card, isFlipped, onClick}){
  const base = "aspect-square round-xl text-4xl transition active:scale-95 cursor-pointer";

  let look = "bg-indigo-500 text-transparent";
  if(card.matched){
    look = "bg-green-200 dark:bg-green-800 cursor-default";
  }else if(isFlipped){
    look = "bg-white dark:bg-slate-700";
  }

  return(
    <button className={`${base} ${look}`} onClick={onClick} >
      {card.emoji}
    </button>
  );
}

export default function App(){
  const [cards, setCards] = useState(createDeck);
  const [flipped, setFlippedIds] = useState([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [started, setStarted] = useState(false);

  const won = cards.every((c) => c.matched);

  useEffect(() => {
    if(!started) return;
    const timer = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
  }, [started]);

  useEffect(() => {
    if(flipped.length !== 2) return;

    setMoves((m) => m + 1);
    const [first, second] = flipped.map((id) => cards.find((c) => c.id === id));

    if(first.emoji === second.emoji){
      setCards((prev) => 
        prev.map((c) => c.emoji === first.emoji ? {...c, matched: true} : c)
      );
      setFlippedIds([]);
    } else{
      const timeout = setTimeout(() => setFlippedIds([]), 800);
      return () => clearTimeout(timeout);
    }
  }, [flipped, cards]);

  function handleCardClick(card){
    if(flipped.length === 2) return;
    if(flipped.includes(card.id)) return;
    if(card.matched) return;

    setStarted(true);
    setFlippedIds([...flipped, card.id]);
  }
  function newGame(){
    setCards(createDeck());
    setFlippedIds([]);
    setMoves(0);
    setSeconds(0);
    setStarted(false);
  }

  return(
    <div className="min-h-screen flex flex-col items-center px-3 py-5 bg-violet-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
       <h1 className="text-2xl font-bold mb-3">🧠 Memory Game</h1>
      <div className="flex gap-5 mb-4 text-lg">
        <span>Moves: {moves}</span>
        <span>Time: {seconds}</span>

        <div className="grid grid-cols-4 gap-2.5 w-full max-w-sm">
          {cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              isFlipped={flipped.includes(card.id)}
              onClick={() => handleCardClick(card)}
            />
          ))} 
        </div>

        <div className="min-h-6 my-4 font-semibold">
          {won && `🎉 You won in ${moves} moves and ${seconds} seconds!`}
        </div>

        <button 
        onClick={newGame}
        className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded"
        >New Game</button>
      </div>
    </div>
  )
}