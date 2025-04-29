import { Button } from "@/components/ui/button";
import { type GameQuestion } from "@shared/schema";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface GameContentProps {
  question: GameQuestion;
  showAnswer: boolean;
  onShowAnswer: () => void;
}

const GameContent = ({ question, showAnswer, onShowAnswer }: GameContentProps) => {
  // استخراج الفئة من السؤال
  const [categoryName, setCategoryName] = useState<string>(""); 
  const [extraCluesList, setExtraCluesList] = useState<string[]>([]);
  
  // الحصول على اسم الفئة من الAPI عند تحميل السؤال
  useEffect(() => {
    const fetchCategoryName = async () => {
      try {
        const response = await fetch(`/api/categories/${question.categoryId}`);
        if (response.ok) {
          const category = await response.json();
          setCategoryName(category.name);
        }
      } catch (error) {
        console.error("Error fetching category:", error);
      }
    };
    
    fetchCategoryName();
    
    // معالجة تلميحات لعبة "من أنا"
    if (question.extraClues && Array.isArray(question.extraClues)) {
      setExtraCluesList(question.extraClues as string[]);
    }
  }, [question]);

  // محتوى اللعبة الأساسية (بحر حرب، تخمين أسماء، معادلة)
  const renderDefaultGameContent = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-blue-50 border-2 border-blue-200 p-4 rounded-lg shadow-sm">
          <h3 className="text-xl font-bold mb-2 text-blue-800 bg-blue-100 rounded-md px-3 py-1 inline-block">التلميح الأول</h3>
          <p className="text-lg text-gray-900 mt-2">{question.clue1}</p>
        </div>

        <div className="bg-green-50 border-2 border-green-200 p-4 rounded-lg shadow-sm">
          <h3 className="text-xl font-bold mb-2 text-green-800 bg-green-100 rounded-md px-3 py-1 inline-block">التلميح الثاني</h3>
          <p className="text-lg text-gray-900 mt-2">{question.clue2}</p>
        </div>
      </div>

      <div className="text-center mb-8">
        <div className="bg-[#333333] inline-block px-8 py-4 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-2">عدد الحروف</h3>
          <p className="text-3xl font-bold text-secondary">{question.letterCount}</p>
        </div>
      </div>
    </>
  );
  
  // محتوى لعبة "أكمل المثل"
  const renderCompleteProverbContent = () => (
    <>
      <div className="mb-6">
        <div className="bg-yellow-50 border-2 border-yellow-200 p-6 rounded-lg shadow-sm">
          <h3 className="text-2xl font-bold mb-4 text-yellow-800 bg-yellow-100 rounded-md px-3 py-1 inline-block">المثل</h3>
          <p className="text-2xl text-gray-900 mt-4 text-center leading-10 font-medium">
            {question.clue1} <span className="bg-red-100 px-3 rounded-lg text-red-600 mx-2">؟؟؟</span> {question.clue2}
          </p>
          
          {question.missingText && (
            <div className="mt-4 text-center">
              <p className="text-md text-gray-600">المطلوب: <span className="font-bold">{question.missingText}</span></p>
            </div>
          )}
        </div>
      </div>
    </>
  );
  
  // محتوى لعبة "من أنا"
  const renderWhoAmIContent = () => {
    // إنشاء مصفوفة دائماً من 6 عناصر
    let displayClues: string[] = [];
    
    // استخدام التلميحات الإضافية إذا وجدت
    if (extraCluesList.length > 0) {
      displayClues = [...extraCluesList];
    }
    
    // إضافة التلميحات الأساسية إذا لم تكتمل المصفوفة
    if (displayClues.length < 6) {
      if (displayClues.length === 0) {
        displayClues.push(question.clue1, question.clue2);
      }
      
      // إكمال المصفوفة إلى 6 عناصر
      while (displayClues.length < 6) {
        displayClues.push("");
      }
    }
    
    // اقتصار العدد على 6 في حال كانت أكثر من ذلك
    displayClues = displayClues.slice(0, 6);
    
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {displayClues.map((clue, index) => (
            <div key={index} className="bg-purple-50 border-2 border-purple-200 p-4 rounded-lg shadow-sm">
              <h3 className="text-md font-bold mb-2 text-purple-800 bg-purple-100 rounded-md px-3 py-1 inline-block">معلومة {index + 1}</h3>
              <p className="text-lg text-gray-900 mt-2">{clue || "..."}</p>
            </div>
          ))}
        </div>
        
        <div className="text-center mb-8 mt-4">
          <div className="bg-purple-800 inline-block px-8 py-4 rounded-lg">
            <h3 className="text-xl font-bold text-white mb-2">من أنا؟</h3>
          </div>
        </div>
      </>
    );
  };
  
  // محتوى لعبة "صور"
  const renderImageContent = () => (
    <>
      <div className="mb-6">
        <div className="bg-blue-50 border-2 border-blue-200 p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-bold mb-4 text-blue-800 bg-blue-100 rounded-md px-3 py-1 inline-block">التعليمات</h3>
          <p className="text-lg text-gray-900 mt-2 mb-6">{question.clue1}</p>
          
          {question.imageUrl ? (
            <div className="flex justify-center mt-4 mb-4">
              <img 
                src={question.imageUrl} 
                alt="صورة السؤال" 
                className="max-w-full max-h-[400px] rounded-lg shadow-lg object-contain border-4 border-white"
              />
            </div>
          ) : (
            <div className="text-center p-8 bg-gray-100 rounded-lg">
              <p className="text-gray-500">لا توجد صورة متاحة</p>
            </div>
          )}
          
          <p className="text-lg text-gray-900 mt-6">{question.clue2}</p>
        </div>
      </div>
    </>
  );
  
  // اختيار نوع المحتوى المناسب حسب الفئة
  const renderGameContent = () => {
    switch (categoryName) {
      case "أكمل المثل":
        return renderCompleteProverbContent();
      case "من أنا":
        return renderWhoAmIContent();
      case "صور":
        return renderImageContent();
      default:
        return renderDefaultGameContent();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-6 mb-8">
      {/* عنوان اللعبة */}
      <h2 className="text-2xl font-bold text-center mb-6 pb-2 border-b border-gray-200">{categoryName}</h2>
      
      {/* محتوى اللعبة المناسب حسب الفئة */}
      {renderGameContent()}

      {/* عرض الإجابة عند الضغط على الزر */}
      {showAnswer ? (
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-accent inline-block px-8 py-4 rounded-lg">
            <h3 className="text-xl font-bold text-white mb-2">الإجابة</h3>
            <p className="text-3xl font-bold text-white">{question.answer}</p>
          </div>
        </motion.div>
      ) : null}

      {/* زر إظهار الإجابة */}
      <div className="text-center">
        <Button
          onClick={onShowAnswer}
          disabled={showAnswer}
          className={`bg-secondary text-white text-xl px-6 py-6 rounded-lg shadow-lg hover:bg-secondary/80 transition ${!showAnswer ? "btn-glow" : "opacity-50"}`}
          size="lg"
        >
          <i className="fas fa-eye ml-2"></i> إظهار الإجابة
        </Button>
      </div>
    </div>
  );
};

export default GameContent;
