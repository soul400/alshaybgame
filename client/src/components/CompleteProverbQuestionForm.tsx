import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useGameContext } from "@/context/GameContext";

interface CompleteProverbQuestionFormProps {
  onClose: () => void;
}

const CompleteProverbQuestionForm: React.FC<CompleteProverbQuestionFormProps> = ({ onClose }) => {
  const [clue1, setClue1] = useState(""); // الجزء الأول من المثل
  const [clue2, setClue2] = useState(""); // الجزء الثاني من المثل
  const [missingText, setMissingText] = useState(""); // النص المفقود (الجزء المطلوب)
  const [answer, setAnswer] = useState(""); // الإجابة الكاملة
  const [letterCount, setLetterCount] = useState(""); // عدد حروف الإجابة
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showNotification } = useGameContext();
  const queryClient = useQueryClient();

  const questionMutation = useMutation({
    mutationFn: async (questionData: any) => {
      const res = await apiRequest("POST", "/api/questions", questionData);
      return res.json();
    },
    onSuccess: () => {
      showNotification("تم إضافة المثل بنجاح");
      queryClient.invalidateQueries({ queryKey: ["/api/questions"] });
      onClose();
    },
    onError: (error) => {
      console.error("Error creating proverb question:", error);
      showNotification("حدث خطأ أثناء إضافة المثل", "error");
      setIsSubmitting(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clue1 || !clue2 || !missingText || !answer || !letterCount) {
      showNotification("يرجى ملء جميع الحقول المطلوبة", "error");
      return;
    }
    
    const letterCountNum = parseInt(letterCount);
    if (isNaN(letterCountNum)) {
      showNotification("عدد الحروف يجب أن يكون رقمًا", "error");
      return;
    }
    
    setIsSubmitting(true);
    
    // الحصول على معرف فئة "أكمل المثل"
    const getCategoryId = async () => {
      try {
        const res = await fetch("/api/categories");
        const categories = await res.json();
        const proverb = categories.find((cat: any) => cat.name === "أكمل المثل");
        if (!proverb) {
          showNotification("لم يتم العثور على فئة أكمل المثل", "error");
          setIsSubmitting(false);
          return;
        }
        
        // إنشاء السؤال
        const questionData = {
          categoryId: proverb.id,
          clue1: clue1, // الجزء الأول من المثل
          clue2: clue2, // الجزء الثاني من المثل
          missingText: missingText, // النص المفقود
          answer: answer, // الإجابة الكاملة
          letterCount: letterCountNum // عدد حروف الإجابة
        };
        
        questionMutation.mutate(questionData);
      } catch (error) {
        console.error("Error fetching categories:", error);
        showNotification("حدث خطأ أثناء إضافة المثل", "error");
        setIsSubmitting(false);
      }
    };
    
    getCategoryId();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-center border-b border-gray-200 pb-4 mb-6">
        إضافة مثل جديد للعبة أكمل المثل
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-6">
            <h3 className="text-xl font-bold text-yellow-800 mb-4">نص المثل</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-bold mb-2">الجزء الأول من المثل *</label>
                <Textarea
                  value={clue1}
                  onChange={(e) => setClue1(e.target.value)}
                  placeholder="مثال: قال انفخ..."
                  className="w-full"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">أدخل الجزء الأول من المثل قبل النص المفقود</p>
              </div>
              
              <div>
                <label className="block text-gray-700 font-bold mb-2">الجزء الثاني من المثل *</label>
                <Textarea
                  value={clue2}
                  onChange={(e) => setClue2(e.target.value)}
                  placeholder="مثال: ...قال ما من برطم"
                  className="w-full"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">أدخل الجزء الثاني من المثل بعد النص المفقود</p>
              </div>
            </div>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 mb-6">
            <h3 className="text-xl font-bold text-orange-800 mb-4">الإجابة</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-bold mb-2">النص المفقود *</label>
                <Input
                  value={missingText}
                  onChange={(e) => setMissingText(e.target.value)}
                  placeholder="الكلمة المفقودة من المثل"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">أدخل النص المفقود الذي سيكمل المثل</p>
              </div>
              
              <div>
                <label className="block text-gray-700 font-bold mb-2">المثل كاملاً *</label>
                <Input
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="المثل بالكامل"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">أدخل المثل كاملاً للتحقق من الإجابة</p>
              </div>
              
              <div>
                <label className="block text-gray-700 font-bold mb-2">عدد حروف الإجابة *</label>
                <Input
                  value={letterCount}
                  onChange={(e) => setLetterCount(e.target.value)}
                  placeholder="عدد الحروف (رقم فقط)"
                  type="number"
                  min="1"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">أدخل عدد حروف النص المفقود</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 rtl:space-x-reverse">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="ml-2"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className={isSubmitting ? "opacity-70" : ""}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
                  <span>جاري الإضافة...</span>
                </>
              ) : (
                "إضافة المثل"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CompleteProverbQuestionForm;