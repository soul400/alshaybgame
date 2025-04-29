import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useGameContext } from "@/context/GameContext";

interface WhoAmIQuestionFormProps {
  onClose: () => void;
}

const WhoAmIQuestionForm: React.FC<WhoAmIQuestionFormProps> = ({ onClose }) => {
  const [clue1, setClue1] = useState("");
  const [clue2, setClue2] = useState("");
  const [clue3, setClue3] = useState("");
  const [clue4, setClue4] = useState("");
  const [clue5, setClue5] = useState("");
  const [clue6, setClue6] = useState("");
  const [answer, setAnswer] = useState("");
  const [letterCount, setLetterCount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showNotification } = useGameContext();
  const queryClient = useQueryClient();

  const questionMutation = useMutation({
    mutationFn: async (questionData: any) => {
      const res = await apiRequest("POST", "/api/questions", questionData);
      return res.json();
    },
    onSuccess: () => {
      showNotification("تم إضافة السؤال بنجاح");
      queryClient.invalidateQueries({ queryKey: ["/api/questions"] });
      onClose();
    },
    onError: (error) => {
      console.error("Error creating question:", error);
      showNotification("حدث خطأ أثناء إضافة السؤال", "error");
      setIsSubmitting(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clue1 || !clue2 || !answer || !letterCount) {
      showNotification("يرجى ملء المعلومات الأولى والثانية والإجابة وعدد الحروف على الأقل", "error");
      return;
    }
    
    const letterCountNum = parseInt(letterCount);
    if (isNaN(letterCountNum)) {
      showNotification("عدد الحروف يجب أن يكون رقمًا", "error");
      return;
    }
    
    setIsSubmitting(true);
    
    // جمع جميع التلميحات في مصفوفة
    const extraClues: string[] = [];
    if (clue1) extraClues.push(clue1);
    if (clue2) extraClues.push(clue2);
    if (clue3) extraClues.push(clue3);
    if (clue4) extraClues.push(clue4);
    if (clue5) extraClues.push(clue5);
    if (clue6) extraClues.push(clue6);
    
    // الحصول على معرف فئة "من أنا"
    const getCategoryId = async () => {
      try {
        const res = await fetch("/api/categories");
        const categories = await res.json();
        const whoAmICategory = categories.find((cat: any) => cat.name === "من أنا");
        if (!whoAmICategory) {
          showNotification("لم يتم العثور على فئة من أنا", "error");
          setIsSubmitting(false);
          return;
        }
        
        // إنشاء السؤال
        const questionData = {
          categoryId: whoAmICategory.id,
          clue1: clue1,
          clue2: clue2,
          answer,
          letterCount: letterCountNum,
          extraClues: extraClues
        };
        
        questionMutation.mutate(questionData);
      } catch (error) {
        console.error("Error fetching categories:", error);
        showNotification("حدث خطأ أثناء إضافة السؤال", "error");
        setIsSubmitting(false);
      }
    };
    
    getCategoryId();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-center border-b border-gray-200 pb-4 mb-6">
        إضافة سؤال جديد للعبة من أنا
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2">المعلومة الأولى *</label>
              <Textarea
                value={clue1}
                onChange={(e) => setClue1(e.target.value)}
                placeholder="أدخل المعلومة الأولى عن الشخصية"
                className="w-full"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-bold mb-2">المعلومة الثانية *</label>
              <Textarea
                value={clue2}
                onChange={(e) => setClue2(e.target.value)}
                placeholder="أدخل المعلومة الثانية عن الشخصية"
                className="w-full"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2">المعلومة الثالثة</label>
              <Textarea
                value={clue3}
                onChange={(e) => setClue3(e.target.value)}
                placeholder="أدخل المعلومة الثالثة عن الشخصية"
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-bold mb-2">المعلومة الرابعة</label>
              <Textarea
                value={clue4}
                onChange={(e) => setClue4(e.target.value)}
                placeholder="أدخل المعلومة الرابعة عن الشخصية"
                className="w-full"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2">المعلومة الخامسة</label>
              <Textarea
                value={clue5}
                onChange={(e) => setClue5(e.target.value)}
                placeholder="أدخل المعلومة الخامسة عن الشخصية"
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-bold mb-2">المعلومة السادسة</label>
              <Textarea
                value={clue6}
                onChange={(e) => setClue6(e.target.value)}
                placeholder="أدخل المعلومة السادسة عن الشخصية"
                className="w-full"
              />
            </div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 mb-6">
            <h3 className="text-xl font-bold text-purple-800 mb-4">معلومات الإجابة</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-bold mb-2">الإجابة (اسم الشخصية) *</label>
                <Input
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="الإجابة الصحيحة"
                  required
                />
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
                "إضافة السؤال"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default WhoAmIQuestionForm;