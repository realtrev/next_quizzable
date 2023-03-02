/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client";

interface Element extends HTMLDivElement {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ["target"]: HTMLDivElement;
}

export default function InteractiveFlashcards() {
  const handleFlashcardClick = (e: Element) => {
    // get data-card value
    if (e.hasOwnProperty("target")) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      const card = e.target.getAttribute("data-card");
      if (card !== "3") {
        return;
      }
      const cards = document.querySelectorAll(".hero-card[data-card]");
      cards.forEach((card) => {
        // add 1 or wrap around to 1
        let newCard = parseInt(card.getAttribute("data-card") || "1") + 1;
        if (newCard > 3) {
          newCard = 1;
        }
        card.setAttribute("data-card", newCard.toString());
      });
    }
  };

  return (
    <div className="absolute -right-10 z-0">
      <div
        onClick={(e) => handleFlashcardClick(e as unknown as Element)}
        className="hero-card absolute"
        data-card="1"
      >
        are you ready to start?
      </div>
      <div
        onClick={(e) => handleFlashcardClick(e as unknown as Element)}
        className="hero-card absolute"
        data-card="2"
      >
        why not try a new way to study?
      </div>
      <div
        onClick={(e) => handleFlashcardClick(e as unknown as Element)}
        className="hero-card absolute"
        data-card="3"
      >
        who said flashcards had to be boring?
      </div>
    </div>
  );
}
