import { useEffect, useState } from "react";
import "./flip.css";

import type { Card, User } from "../../types";

function CardElem(params: { cards: Array<Card> }) {
  const flipCard = () => {
    // flip card
    const front = document.getElementById("frontCard");
    if (front) {
      front.classList.toggle("front-flipped");
    }
    const back = document.getElementById("backCard");
    if (back) {
      back.classList.toggle("back-flipped");
    }
  };

  const [currentCard, setCurrentCard] = useState(0);
  const [card, setCard] = useState(null as Card | null | undefined);
  const [showAnswer, setShowAnswer] = useState(true);

  const resetCard = () => {
    // flip card
    const front = document.getElementById("frontCard");
    if (front) {
      if (showAnswer) {
        front.classList.remove("front-flipped");
      } else {
        front.classList.add("front-flipped");
      }
    }
    const back = document.getElementById("backCard");
    if (back) {
      if (showAnswer) {
        back.classList.remove("back-flipped");
      } else {
        back.classList.add("back-flipped");
      }
    }
  };

  useEffect(() => {
    if (
      params.cards &&
      params.cards.length > 0 &&
      currentCard < params.cards.length
    ) {
      setCard(params.cards[currentCard]);
    }
  }, [currentCard]);

  if (!card || !params.cards || params.cards.length === 0) {
    return (
      <div className="card relative h-[32rem]" id="card">
        <div className="front absolute top-0 z-10 flex flex h-full w-full flex-col items-center justify-center gap-5 rounded-md border border-gray-300 bg-offwhite p-10">
          <h1 className="text-4xl font-bold text-gray-400">
            Cannot find cards
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="card relative h-[32rem]" onClick={flipCard} id="card">
      <div
        id="frontCard"
        className="front absolute top-0 z-10 flex h-full w-full flex-col gap-5 rounded-md border border-gray-300 bg-offwhite p-10"
      >
        <div className="h-10 w-full">
          <h1 className="text-center text-base font-bold text-gray-600">
            {currentCard + 1} / {params.cards.length}
          </h1>
        </div>
        <div className="flex h-full w-full flex-col items-center justify-center gap-5">
          {card?.image ? (
            <div className="flex h-2/3 items-center justify-center">
              <img
                style={{
                  maxHeight: "100%",
                  maxWidth: "100%",
                  objectFit: "contain",
                  userSelect: "none",
                }}
                src={`/api/files/cards/${card?.id}/${card?.image}`}
                alt={""}
              />
            </div>
          ) : null}
          <h1 className="text-4xl font-normal">{card?.term}</h1>
        </div>
        <div className="grid h-16 grid-cols-2 gap-5">
          <button
            disabled={currentCard === 0}
            className="h-full rounded-md bg-blue-500 px-4 font-bold text-white transition-all duration-200 hover:enabled:bg-blue-700 disabled:bg-gray-500"
            onClick={(e) => {
              if (currentCard > 0) {
                setCurrentCard(currentCard - 1);
                resetCard();
                e.stopPropagation();
              }
            }}
          >
            <h1>Previous</h1>
          </button>
          <button
            disabled={currentCard === params.cards.length - 1}
            className="h-full rounded-md bg-blue-500 px-4 font-bold text-white transition-all duration-200 hover:enabled:bg-blue-700 disabled:bg-gray-500"
            onClick={(e) => {
              if (currentCard < params.cards.length - 1) {
                setCurrentCard(currentCard + 1);
                resetCard();
                e.stopPropagation();
              }
            }}
          >
            <h1>Next</h1>
          </button>
        </div>
      </div>
      <div
        id="backCard"
        className="back absolute top-0 z-0 flex h-full w-full flex-col gap-5 rounded-md border border-gray-300 bg-offwhite p-10"
      >
        <div className="h-10 w-full">
          <h1 className="text-center text-base font-bold text-gray-600">
            {currentCard + 1} / {params.cards.length}
          </h1>
        </div>
        <div className="flex h-full w-full flex-col items-center justify-center gap-5">
          <h1 className="text-4xl font-normal">{card?.definition}</h1>
        </div>
        <div className="grid h-16 grid-cols-2 gap-5">
          <button
            disabled={currentCard === 0}
            className="h-full rounded-md bg-blue-500 px-4 font-bold text-white transition-all duration-200 hover:enabled:bg-blue-700 disabled:bg-gray-500"
            onClick={(e) => {
              if (currentCard > 0) {
                setCurrentCard(currentCard - 1);
                resetCard();
                e.stopPropagation();
              }
            }}
          >
            <h1>Previous</h1>
          </button>
          <button
            disabled={currentCard === params.cards.length - 1}
            className="h-full rounded-md bg-blue-500 px-4 font-bold text-white transition-all duration-200 hover:enabled:bg-blue-700 disabled:bg-gray-500"
            onClick={(e) => {
              if (currentCard < params.cards.length - 1) {
                setCurrentCard(currentCard + 1);
                resetCard();
                e.stopPropagation();
              }
            }}
          >
            <h1>Next</h1>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CardElem;
