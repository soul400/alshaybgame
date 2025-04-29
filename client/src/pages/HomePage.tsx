import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import GameCard from "@/components/GameCard";
import ScoreBoard from "@/components/ScoreBoard";
import DataImport from "@/components/DataImport";
import AddImageQuestionModal from "@/components/AddImageQuestionModal";
import AddWhoAmIQuestionModal from "@/components/AddWhoAmIQuestionModal";
import AddCompleteProverbQuestionModal from "@/components/AddCompleteProverbQuestionModal";
import { useGameContext } from "@/context/GameContext";
import { playWelcomeSound, playCardClickSound } from "@/lib/soundEffects";
import { type GameCategory } from "@shared/schema";

const HomePage = () => {
  const [_, setLocation] = useLocation();
  const { showNotification } = useGameContext();

  // Fetch game categories
  const { data: categories, isLoading: isLoadingCategories } = useQuery<GameCategory[]>({
    queryKey: ["/api/categories"],
  });

  // Show notification and play sound when returning to homepage
  useEffect(() => {
    // Only show welcome notification if we have categories loaded
    if (categories && categories.length > 0) {
      showNotification("مرحباً بك في منصة ألعاب الشايب");
      playWelcomeSound(); // Play welcome sound effect
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
          categories?.map((category: GameCategory) => (
            <GameCard
              key={category.id}
              category={category}
              onClick={() => {
                playCardClickSound();
                setLocation(`/game/${category.id}`);
              }}
            />
          ))
        )}
      </div>

      {/* Score Board */}
      <ScoreBoard />

      {/* قسم إضافة الأسئلة المباشرة */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
        {/* إضافة أسئلة الصور مباشرة */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-center border-b border-gray-200 pb-4 mb-6">
            إضافة مباشرة لأسئلة لعبة الصور
          </h2>
          <div className="flex justify-center">
            <AddImageQuestionModal />
          </div>
          <p className="text-center text-gray-500 mt-4 text-sm">
            يمكنك استخدام هذا الخيار لإضافة أسئلة مع صور مباشرة من جهازك بدلاً من استيرادها من ملف Excel
          </p>
        </div>
        
        {/* إضافة أسئلة من أنا مباشرة */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-center border-b border-gray-200 pb-4 mb-6">
            إضافة مباشرة لأسئلة لعبة من أنا
          </h2>
          <div className="flex justify-center">
            <AddWhoAmIQuestionModal />
          </div>
          <p className="text-center text-gray-500 mt-4 text-sm">
            يمكنك استخدام هذا الخيار لإضافة معلومات الشخصية الست بشكل مباشر بدلاً من استيرادها من ملف Excel
          </p>
        </div>
        
        {/* إضافة أسئلة أكمل المثل مباشرة */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-center border-b border-gray-200 pb-4 mb-6">
            إضافة مباشرة لأسئلة لعبة أكمل المثل
          </h2>
          <div className="flex justify-center">
            <AddCompleteProverbQuestionModal />
          </div>
          <p className="text-center text-gray-500 mt-4 text-sm">
            يمكنك استخدام هذا الخيار لإضافة أمثال مع تحديد الكلمة المفقودة بدلاً من استيرادها من ملف Excel
          </p>
        </div>
      </div>

      {/* Data Import */}
      <DataImport />
    </div>
  );
};

export default HomePage;
