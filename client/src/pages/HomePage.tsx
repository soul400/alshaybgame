import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import GameCard from "@/components/GameCard";
import ScoreBoard from "@/components/ScoreBoard";
import DataImport from "@/components/DataImport";
import { useGameContext } from "@/context/GameContext";

const HomePage = () => {
  const [_, setLocation] = useLocation();
  const { showNotification } = useGameContext();

  // Fetch game categories
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["/api/categories"],
  });

  // Show notification when returning to homepage
  useEffect(() => {
    // Only show welcome notification if we have categories loaded
    if (categories && categories.length > 0) {
      showNotification("مرحباً بك في منصة ألعاب الشايب");
    }
  }, [categories, showNotification]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12 pt-10">
        <h1 className="text-5xl font-bold text-white bg-secondary inline-block px-8 py-4 rounded-lg shadow-lg mb-4 transform transition hover:scale-105 animate-pulse">
          ألعاب الشايب
        </h1>
        <p className="text-2xl text-[#333333] bg-white/80 rounded-full px-6 py-2 inline-block">
          منصة ألعاب تراثية للتجمعات والمناسبات
        </p>
      </div>

      {/* Game Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {isLoadingCategories ? (
          // Show loading skeletons while loading
          Array(8)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden h-64 animate-pulse"
              >
                <div className="h-32 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-100 rounded"></div>
                </div>
              </div>
            ))
        ) : (
          // Show game categories
          categories?.map((category) => (
            <GameCard
              key={category.id}
              category={category}
              onClick={() => setLocation(`/game/${category.id}`)}
            />
          ))
        )}
      </div>

      {/* Score Board */}
      <ScoreBoard />

      {/* Data Import */}
      <DataImport />
    </div>
  );
};

export default HomePage;
