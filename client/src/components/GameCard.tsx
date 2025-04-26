import { type GameCategory } from "@shared/schema";

interface GameCardProps {
  category: GameCategory;
  onClick: () => void;
}

const GameCard = ({ category, onClick }: GameCardProps) => {
  // Map category name to background color with gradient overlay
  const getBgColor = (index: number) => {
    const colors = [
      "bg-gradient-to-r from-blue-500 to-blue-700", 
      "bg-gradient-to-r from-pink-500 to-purple-600", 
      "bg-gradient-to-r from-green-500 to-teal-600",
      "bg-gradient-to-r from-yellow-500 to-orange-600"
    ];
    return colors[index % colors.length];
  };

  // Convert ID to array index (0-based)
  const colorIndex = category.id - 1;

  return (
    <div
      className="game-card bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden cursor-pointer border-2 border-white/20"
      onClick={onClick}
      data-game={category.name}
    >
      <div className={`h-32 ${getBgColor(colorIndex)} flex items-center justify-center relative`}>
        <div className="absolute inset-0 bg-black opacity-10 z-0"></div>
        <div className="relative z-10 transform transition-all duration-500 hover:scale-125">
          <i className={`fas ${category.icon} text-white text-5xl drop-shadow-lg`}></i>
        </div>
      </div>
      <div className="p-4 text-center">
        <h3 className="game-card-title">{category.name}</h3>
        <p className="text-gray-600 text-sm mt-2 font-medium">{category.description}</p>
      </div>
    </div>
  );
};

export default GameCard;
