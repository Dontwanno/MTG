import React from "react";
import "./style.scss";

const sidebarIcons = [
  {
    className: "mtg-sidebar__icon mtg-sidebar__icon--colorless",
    title: "Colorless",
    src: "/svg/wastes.svg",
    alt: "Colorless",
    count: 0,
    style: { background: "#bdbdbd" },
  },
  {
    className: "mtg-sidebar__icon mtg-sidebar__icon--island",
    title: "Island",
    src: "/svg/island.svg",
    alt: "Island",
    count: 0,
    style: { background: "#2767d0" },
  },
  {
    className: "mtg-sidebar__icon mtg-sidebar__icon--mountain",
    title: "Mountain",
    src: "/svg/mountain.svg",
    alt: "Mountain",
    count: 0,
    style: { background: "#ef4444" },
  },
  {
    className: "mtg-sidebar__icon mtg-sidebar__icon--swamp",
    title: "Swamp",
    src: "/svg/swamp.svg",
    alt: "Swamp",
    count: 0,
    style: { background: "#6b21a8" },
  },
  {
    className: "mtg-sidebar__icon mtg-sidebar__icon--plains",
    title: "Plains",
    src: "/svg/plains.svg",
    alt: "Plains",
    count: 0,
    style: { background: "#facc15" },
  },
  {
    className: "mtg-sidebar__icon mtg-sidebar__icon--forest",
    title: "Forest",
    src: "/svg/forest.svg",
    alt: "Forest",
    count: 0,
    style: { background: "#17af4f" },
  },
  {
    className: "mtg-sidebar__icon mtg-sidebar__icon--graveyard",
    title: "Graveyard",
    src: "/svg/tombstone-rip-svgrepo-com.svg",
    alt: "Graveyard",
    count: 0,
    style: { background: "#4a5568" },
  },
  {
    className: "mtg-sidebar__icon",
    title: "Library",
    src: "/svg/book-svgrepo-com.svg",
    alt: "Library",
    count: 0,
    style: { background: "#883535" },
  },
  {
    className: "mtg-sidebar__icon",
    title: "Life Total",
    src: "/svg/heart-svgrepo-com.svg",
    alt: "Life Total",
    count: 20,
    style: { background: "red" },
  },
  {
    className: "mtg-sidebar__icon",
    title: "Hand",
    src: "/svg/cards-svgrepo-com.svg",
    alt: "Hand",
    count: 7,
    style: { background: "#fbbf24" },
  },
];

const Sidebar = () => (
  <aside className="mtg-sidebar">
    {sidebarIcons.map((icon, i) => (
      <div
        key={icon.title}
        className={icon.className}
        title={icon.title}
        style={icon.style}
      >
        <img src={icon.src} alt={icon.alt} width={44} height={44} />
        <span className="mtg-sidebar__count">{icon.count}</span>
      </div>
    ))}
  </aside>
);

export default Sidebar;

