import CardList from "@/magic/CardList";
import MTGCard from "@/magic/MTGCard";
import lotusBack from "@/magic/lotus_back.png";
import Sidebar from "@/magic/Sidebar";
import BattlefieldCardList from "@/magic/BattlefieldCardList";

const url = "https://api.scryfall.com/cards/named?exact=";

export default async function Home() {
  // Card names to look up
  const cardNames = [
    "Monastery Swiftspear",
    "Slickshot Show-Off",
    "Sleight of Hand",
    "Lightning Bolt",
    "Opt",
    "Brainstorm",
      "Stormchaser's Talent"
  ];

  // Fetch each card by name
  const fetchCardByName = async (name: string) => {
    const res = await fetch(url + encodeURIComponent(name), { cache: "no-store" });
    const data = await res.json();
    return data.image_uris?.png || data.image_uris?.large || "";
  };

  const srcs: string[] = [];
  for (const name of cardNames) {
    const img = await fetchCardByName(name);
    if (img) srcs.push(img);
  }

  // Example battlefield cards (use first 3 from hand for demo)
  const battlefieldSrcs = srcs.slice(0, 3);

  return (
    <div>
      <Sidebar />
      <BattlefieldCardList srcs={battlefieldSrcs} />
      <CardList srcs={srcs} />
      <MTGCard src={lotusBack} initialX={100} initialY={100} />
    </div>
  );
}
