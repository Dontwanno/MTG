"use client";
import React, { useRef, useEffect } from "react";
import "./style.scss";
import type { StaticImageData } from "next/image";

let globalZ = 1;

const MTGCard = ({ src, initialX = 0, initialY = 0, forcePosition }: { src?: string | StaticImageData, initialX?: number, initialY?: number, forcePosition?: {x: number, y: number} }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // State refs for animation
  const state = useRef({
    cardx: 0,
    cardy: 0,
    ocardx: 0,
    ocardy: 0,
    pinx: 0,
    piny: 0,
    pinxperc: 50,
    pinyperc: 50,
    targetx: 0,
    targety: 0,
    rx: 0,
    ry: 0,
    targetrx: 0,
    targetry: 0,
    scale: 1,
    targetscale: 1,
    baseScale: 1, // <--- add this
    cardw: 250,
    cardh: 350,
    ww: 0,
    wh: 0,
    md: false,
    mx: initialX,
    my: initialY,
  });

  useEffect(() => {
    const card = cardRef.current;
    const image = imageRef.current;
    if (!card || !image) return;

    // Set card size and center or use initialX/initialY
    const setCardDimensions = () => {
      state.current.cardw = image.width;
      state.current.cardh = image.height;
      state.current.ww = window.innerWidth;
      state.current.wh = window.innerHeight;
      state.current.cardx = initialX;
      state.current.cardy = initialY;
      state.current.ocardx = state.current.cardx;
      state.current.ocardy = state.current.cardy;
      state.current.targetx = state.current.cardx;
      state.current.targety = state.current.cardy;
      // Do not set mx/my here, only on initial state
      card.style.left = `${state.current.cardx}px`;
      card.style.top = `${state.current.cardy}px`;
    };
    setCardDimensions();
    window.addEventListener("resize", setCardDimensions);
    if (!image.complete) {
      image.onload = setCardDimensions;
    }

    // Store original z-index for hover
    let originalZ = card.style.zIndex;

    // Mouse events
    const onMouseDown = (e: MouseEvent) => {
      state.current.md = true;
      state.current.mx = e.pageX;
      state.current.my = e.pageY;
      // Pin to center
      state.current.pinx = state.current.cardw / 2;
      state.current.piny = state.current.cardh / 2;
      state.current.pinxperc = 100 - (state.current.pinx / state.current.cardw) * 100;
      state.current.pinyperc = 100 - (state.current.piny / state.current.cardh) * 100;
      state.current.baseScale = 1.2; // <--- scale up on drag
    };
    const onMouseUp = () => {
      state.current.md = false;
      state.current.baseScale = 1; // <--- reset scale after drag
    };
    const onMouseMove = (e: MouseEvent) => {
      if (state.current.md) {
        state.current.mx = e.pageX;
        state.current.my = e.pageY;
      }
    };
    card.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);

    // Bring card to top on click
    const onClick = () => {
      globalZ++;
      card.style.zIndex = globalZ.toString();
      originalZ = card.style.zIndex;
    };
    card.addEventListener("mousedown", onClick);

    // Hover events for z-index and scale
    const onMouseEnter = () => {
      originalZ = card.style.zIndex;
      globalZ++;
      card.style.zIndex = globalZ.toString();
      if (!state.current.md) state.current.baseScale = 1.15; // <--- scale up on hover
    };
    const onMouseLeave = () => {
      if (!state.current.md) {
        state.current.baseScale = 1; // <--- reset scale on leave
        card.style.zIndex = originalZ;
      }
    };
    card.addEventListener("mouseenter", onMouseEnter);
    card.addEventListener("mouseleave", onMouseLeave);

    // Animation loop
    let running = true;
    function loop() {
      // Set new target position
      state.current.targetx = state.current.mx - state.current.cardx - state.current.pinx;
      state.current.targety = state.current.my - state.current.cardy - state.current.piny;
      // Lerp to new position
      state.current.cardx += state.current.targetx * 0.25;
      state.current.cardy += state.current.targety * 0.25;
      // Contain card to window bounds
      if (state.current.cardx < -state.current.cardw / 2) state.current.cardx = -state.current.cardw / 2;
      if (state.current.cardx > state.current.ww - state.current.cardw / 2) state.current.cardx = state.current.ww - state.current.cardw / 2;
      if (state.current.cardy < -state.current.cardh / 2) state.current.cardy = -state.current.cardh / 2;
      if (state.current.cardy > state.current.wh - state.current.cardh / 2) state.current.cardy = state.current.wh - state.current.cardh / 2;
      // Get rotation based on how much card moved
      state.current.targetrx = (state.current.ocardy - state.current.cardy - state.current.rx) * 3;
      state.current.targetry = (state.current.cardx - state.current.ocardx - state.current.ry) * 3;
      // Lock rotation
      state.current.targetrx = Math.max(-90, Math.min(90, state.current.targetrx));
      state.current.targetry = Math.max(-90, Math.min(90, state.current.targetry));
      // Lerp to new rotation
      state.current.rx += state.current.targetrx * 0.1;
      state.current.ry += state.current.targetry * 0.1;
      // Lerp to baseScale
      state.current.targetscale = state.current.baseScale - state.current.scale;
      state.current.scale += state.current.targetscale * 0.2;
      // Apply the transform
      card.style.left = `${state.current.cardx}px`;
      card.style.top = `${state.current.cardy}px`;
      image.style.transformOrigin = `${state.current.pinxperc}% ${state.current.pinyperc}%`;
      image.style.transform = `scale(${state.current.scale}) rotateY(${state.current.ry}deg) rotateX(${state.current.rx}deg)`;
      // Store old card position
      state.current.ocardx = state.current.cardx;
      state.current.ocardy = state.current.cardy;
      if (running) requestAnimationFrame(loop);
    }
    loop();

    return () => {
      running = false;
      window.removeEventListener("resize", setCardDimensions);
      card.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
      card.removeEventListener("mousedown", onClick);
      card.removeEventListener("mouseenter", onMouseEnter);
      card.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [initialX, initialY]);

  useEffect(() => {
    if (!forcePosition) return;
    const card = cardRef.current;
    const image = imageRef.current;
    if (!card || !image) return;
    const x = forcePosition.x;
    const y = forcePosition.y;
    const cardw = image.width;
    const cardh = image.height;
    // Set everything to the center of the card
    state.current.cardx = x;
    state.current.cardy = y;
    state.current.ocardx = x;
    state.current.ocardy = y;
    state.current.mx = x + cardw / 2;
    state.current.my = y + cardh / 2;
    state.current.targetx = 0;
    state.current.targety = 0;
    state.current.pinx = cardw / 2;
    state.current.piny = cardh / 2;
    state.current.pinxperc = 100 - (state.current.pinx / cardw) * 100;
    state.current.pinyperc = 100 - (state.current.piny / cardh) * 100;
    card.style.left = `${x}px`;
    card.style.top = `${y}px`;
  }, [forcePosition]);

  useEffect(() => {
    // On initial load, set all state to the center of the card
    const card = cardRef.current;
    const image = imageRef.current;
    if (!card || !image) return;
    const cardw = image.width;
    const cardh = image.height;
    state.current.cardw = cardw;
    state.current.cardh = cardh;
    state.current.ww = window.innerWidth;
    state.current.wh = window.innerHeight;
    state.current.cardx = initialX;
    state.current.cardy = initialY;
    state.current.ocardx = initialX;
    state.current.ocardy = initialY;
    state.current.targetx = 0;
    state.current.targety = 0;
    state.current.mx = initialX + cardw / 2;
    state.current.my = initialY + cardh / 2;
    state.current.pinx = cardw / 2;
    state.current.piny = cardh / 2;
    state.current.pinxperc = 100 - (state.current.pinx / cardw) * 100;
    state.current.pinyperc = 100 - (state.current.piny / cardh) * 100;
    card.style.left = `${initialX}px`;
    card.style.top = `${initialY}px`;
  }, [initialX, initialY]);

  return (
    <div className="card" ref={cardRef} style={{ position: "absolute", left: 0, top: 0 }}>
      <img
        ref={imageRef}
        src={src ? (typeof src === "string" ? src : src.src) : "https://cards.scryfall.io/png/front/3/9/3935034b-611f-4ce7-9bba-14c3b31eb597.png?1717014283"}
        className="card-image"
        draggable="false"
        alt="Hearthstone Card"
      />
    </div>
  );
};

export default MTGCard;


