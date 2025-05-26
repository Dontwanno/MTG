"use client";
import React, { useState } from "react";
import MTGCard from "./MTGCard";

export default function CardList({ srcs }: { srcs: string[] }) {
  // Helper to get ordered positions
  const getOrderedPositions = () =>
    srcs.map((_, i) => ({
      x: 100 + i * 100, // 240px card width, no gap
      y: 550,
    }));

  // State for card positions
  const [positions, setPositions] = useState(getOrderedPositions());

  // Handler to reset positions and z-index
  const handleOrder = () => {
    setPositions(getOrderedPositions());
    // Reset globalZ and all card z-indexes
    if (typeof window !== 'undefined') {
      // @ts-ignore
      if (window.HeartstoneGlobalZ !== undefined) window.HeartstoneGlobalZ = 1;
      else window.HeartstoneGlobalZ = 1;
      // Reset all card z-indexes
      document.querySelectorAll('.card').forEach(card => {
        (card as HTMLElement).style.zIndex = '1';
      });
    }
  };

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <button
        style={{ position: "absolute", top: 20, left: 20, zIndex: 1000 , background: 'darkgrey' , padding: '5px', color: 'black', borderRadius: '10px', fontSize: '16px', transition: 'background 0.2s, transform 0.18s' }}
        onClick={handleOrder}
        onMouseEnter={e => { e.currentTarget.style.background = 'lightgrey'; e.currentTarget.style.transform = 'scale(1.08)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'darkgrey'; e.currentTarget.style.transform = 'scale(1)'; }}
      >
        order

      </button>
      {srcs.map((src, i) => (
        <MTGCard
          key={i}
          src={src}
          initialX={positions[i].x}
          initialY={positions[i].y}
          forcePosition={positions[i]}
        />
      ))}
    </div>
  );
}

