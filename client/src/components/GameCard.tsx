import { type GameCategory } from "@shared/schema";
import { playCardClickSound } from "@/lib/soundEffects";

interface GameCardProps {
  category: GameCategory;
  onClick: () => void;
}

const GameCard = ({ category, onClick }: GameCardProps) => {
  // Map category name to background color with gradient overlay
  const getBgColor = (name: string) => {
    // تعيين لون خاص لكل فئة من فئات الألعاب
    const colorMap: Record<string, string> = {
      'بحر حرب': "bg-gradient-to-r from-blue-500 to-blue-700",
      'تخمين أسماء': "bg-gradient-to-r from-pink-500 to-purple-600",
      'معادلة': "bg-gradient-to-r from-green-500 to-teal-600",
      'أكمل المثل': "bg-gradient-to-r from-yellow-500 to-orange-600",
      'من أنا': "bg-gradient-to-r from-purple-500 to-indigo-700",
      'صور': "bg-gradient-to-r from-red-500 to-pink-600"
    };
    
    // إرجاع اللون المناسب أو لون افتراضي
    return colorMap[name] || "bg-gradient-to-r from-gray-500 to-gray-700";
  };

  return (
    <div
      className="game-card bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden cursor-pointer border-2 border-white/20"
      onClick={() => {
        // تشغيل صوت النقر عند اختيار اللعبة
        playCardClickSound();
        onClick();
      }}
      data-game={category.name}
    >
      <div className={`h-32 ${getBgColor(category.name)} flex items-center justify-center relative`}>
        <div className="absolute inset-0 bg-black opacity-10 z-0"></div>
        <div className="relative z-10 transform transition-all duration-500 hover:scale-125">
          <i className={`fas ${category.icon} text-white text-5xl drop-shadow-lg`}></i>
        </div>
      </div>
      <div className="p-4 text-center">
        <h3 className="game-card-title">{category.name}</h3>
        <p className="text-gray-900 text-sm mt-2 font-medium">{category.description}</p>
      </div>
    </div>
  );
};

export default GameCard;
