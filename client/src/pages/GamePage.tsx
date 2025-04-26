import { useEffect, useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import GameContent from "@/components/GameContent";
import GameScoreUpdater from "@/components/GameScoreUpdater";
import { useGameContext } from "@/context/GameContext";
import { playTimerEndSound } from "@/lib/soundEffects";
import { shuffleArray } from "@/lib/utils";

const GamePage = () => {
  const params = useParams<{ gameId: string }>();
  const gameId = parseInt(params.gameId);
  const [_, setLocation] = useLocation();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerRunning, setTimerRunning] = useState(true);
  const { showNotification } = useGameContext();

  // Fetch the game category
  const { data: category } = useQuery({
    queryKey: [`/api/categories/${gameId}`],
  });

  // حالة لتخزين الأسئلة العشوائية المخلوطة
  const [shuffledQuestions, setShuffledQuestions] = useState<any[]>([]);
  
  // جلب الأسئلة لهذه الفئة
  const {
    data: questions,
    isLoading: isLoadingQuestions,
    isError: hasErrorQuestions,
  } = useQuery({
    queryKey: ["/api/questions", gameId],
    queryFn: async () => {
      const response = await fetch(`/api/questions?categoryId=${gameId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }
      return response.json();
    },
  });
  
  // خلط الأسئلة عشوائيًا عند تحميلها لأول مرة
  useEffect(() => {
    if (questions && questions.length > 0) {
      // خلط الأسئلة بشكل عشوائي وتخزينها في الحالة
      const randomQuestions = shuffleArray(questions);
      setShuffledQuestions(randomQuestions);
    }
  }, [questions]);

  // السؤال الحالي (من الأسئلة المخلوطة)
  const currentQuestion = shuffledQuestions.length > 0
    ? shuffledQuestions[currentQuestionIndex % shuffledQuestions.length]
    : null;

  // Timer effect
  useEffect(() => {
    if (!timerRunning) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimerRunning(false);
          setShowAnswer(true);
          playTimerEndSound();
          showNotification("انتهى الوقت!");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timerRunning, showNotification]);

  // Reset timer and state when moving to next question
  const nextQuestion = () => {
    setCurrentQuestionIndex((prev) => prev + 1);
    setShowAnswer(false);
    setTimeLeft(60);
    setTimerRunning(true);
    showNotification("السؤال التالي");
  };

  // Reset timer when navigating to this page
  useEffect(() => {
    setTimeLeft(60);
    setTimerRunning(true);
    setShowAnswer(false);
  }, [gameId]);

  // Handle show answer
  const handleShowAnswer = () => {
    setShowAnswer(true);
    setTimerRunning(false);
  };

  // Get width percentage for timer bar
  const timerWidthPercentage = (timeLeft / 60) * 100;
  
  // Determine timer bar color based on time left
  const getTimerBarColor = () => {
    if (timeLeft <= 5) return "bg-destructive";
    if (timeLeft <= 10) return "bg-warning";
    return "bg-accent";
  };

  if (isLoadingQuestions) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <Button onClick={() => setLocation("/")} variant="default">
            <i className="fas fa-arrow-right ml-2"></i> العودة للرئيسية
          </Button>
          <h2 className="text-3xl font-bold bg-secondary text-white px-6 py-2 rounded-lg">
            جاري التحميل...
          </h2>
        </div>
        <div className="bg-white rounded-xl shadow-xl p-6 mb-8 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-neutral h-32 rounded-lg"></div>
            <div className="bg-neutral h-32 rounded-lg"></div>
          </div>
          <div className="h-20 bg-neutral mx-auto w-1/3 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (hasErrorQuestions || !questions || questions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <Button onClick={() => setLocation("/")} variant="default">
            <i className="fas fa-arrow-right ml-2"></i> العودة للرئيسية
          </Button>
          <h2 className="text-3xl font-bold bg-secondary text-white px-6 py-2 rounded-lg">
            {category?.name || "فئة اللعبة"}
          </h2>
        </div>
        <div className="bg-white rounded-xl shadow-xl p-6 mb-8 text-center">
          <h3 className="text-2xl font-bold text-destructive mb-4">
            لا توجد أسئلة متاحة
          </h3>
          <p className="text-lg mb-6">
            يرجى استيراد الأسئلة من ملف Excel أولاً باستخدام قسم استيراد الأسئلة في الصفحة الرئيسية.
          </p>
          <Button onClick={() => setLocation("/")} variant="default" size="lg">
            العودة للصفحة الرئيسية
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Game Header */}
      <div className="flex justify-between items-center mb-8">
        <Button onClick={() => setLocation("/")} variant="default">
          <i className="fas fa-arrow-right ml-2"></i> العودة للرئيسية
        </Button>

        <h2 className="text-3xl font-bold bg-secondary text-white px-6 py-2 rounded-lg">
          {category?.name || "فئة اللعبة"}
        </h2>

        <div className="relative w-40 h-12 bg-neutral rounded-full overflow-hidden shadow-md">
          <div
            className={`absolute top-0 right-0 h-full timer-animation ${getTimerBarColor()}`}
            style={{ width: `${timerWidthPercentage}%` }}
          ></div>
          <div className="absolute top-0 right-0 w-full h-full flex items-center justify-center">
            <span className={`text-xl font-bold ${timeLeft <= 5 ? "animate-pulse" : ""}`}>
              {timeLeft}
            </span>
          </div>
        </div>
      </div>

      {/* Game Content */}
      {currentQuestion && (
        <GameContent
          question={currentQuestion}
          showAnswer={showAnswer}
          onShowAnswer={handleShowAnswer}
        />
      )}

      {/* Game Score Updater */}
      <GameScoreUpdater onNextQuestion={nextQuestion} />
    </div>
  );
};

export default GamePage;
