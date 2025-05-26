"use client";
import React, { useRef } from "react";
import "./style.scss";

interface BattlefieldCardListProps {
  srcs: string[];
}

const BattlefieldCardList: React.FC<BattlefieldCardListProps> = ({ srcs }) => {
  // Track z-index for hover effect
  const zCounter = useRef(1);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    zCounter.current++;
    e.currentTarget.style.zIndex = zCounter.current.toString();
    e.currentTarget.style.transform = "scale(1.15)";
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = "scale(1)";
    e.currentTarget.style.zIndex = "1";
  };

  return (
    <div
      className="battlefield-card-list"
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "-40px",
        justifyContent: "center",
        alignItems: "flex-end",
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 180,
        zIndex: 10,
        pointerEvents: "none"
      }}
    >
      {srcs.map((src, i) => (
        <div
          key={i}
          className="battlefield-card"
          style={{
            position: "relative",
            left: 0,
            top: 0,
            zIndex: 1,
            transition: "transform 0.18s, z-index 0.1s",
            pointerEvents: "auto"
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <img
            src={src}
            className="card-image"
            draggable="false"
            alt="Battlefield Card"
            style={{ width: 230, height: 340, borderRadius: 8 }}
          />
        </div>
      ))}
    </div>
  );
};

export default BattlefieldCardList;
