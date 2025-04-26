import { type GameCategory } from "@shared/schema";

interface GameCardProps {
  category: GameCategory;
  onClick: () => void;
}

const GameCard = ({ category, onClick }: GameCardProps) => {
  // Map category name to background color
  const getBgColor = (index: number) => {
    const colors = ["bg-primary", "bg-secondary", "bg-accent"];
    return colors[index % colors.length];
  };

  // Convert ID to array index (0-based)
  const colorIndex = category.id - 1;

  return (
    <div
      className="game-card bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer"
      onClick={onClick}
      data-game={category.name}
    >
      <div className={`h-32 ${getBgColor(colorIndex)} flex items-center justify-center`}>
        <i className={`fas ${category.icon} text-white text-5xl`}></i>
      </div>
      <div className="p-4 text-center">
        <h3 className="text-xl font-bold">{category.name}</h3>
        <p className="text-gray-600 text-sm mt-2">{category.description}</p>
      </div>
    </div>
  );
};

export default GameCard;
