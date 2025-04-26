import { Button } from "@/components/ui/button";
import { type GameQuestion } from "@shared/schema";
import { motion } from "framer-motion";

interface GameContentProps {
  question: GameQuestion;
  showAnswer: boolean;
  onShowAnswer: () => void;
}

const GameContent = ({ question, showAnswer, onShowAnswer }: GameContentProps) => {
  return (
    <div className="bg-white rounded-xl shadow-xl p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-neutral p-4 rounded-lg">
          <h3 className="text-xl font-bold mb-2 text-primary">التلميح الأول</h3>
          <p className="text-lg">{question.clue1}</p>
        </div>

        <div className="bg-neutral p-4 rounded-lg">
          <h3 className="text-xl font-bold mb-2 text-primary">التلميح الثاني</h3>
          <p className="text-lg">{question.clue2}</p>
        </div>
      </div>

      <div className="text-center mb-8">
        <div className="bg-[#333333] inline-block px-8 py-4 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-2">عدد الحروف</h3>
          <p className="text-3xl font-bold text-secondary">{question.letterCount}</p>
        </div>
      </div>

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
