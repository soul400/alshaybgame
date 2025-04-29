import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useGameContext } from "@/context/GameContext";
import ImageUploader from "./ImageUploader";

interface ImageQuestionFormProps {
  onClose: () => void;
}

const ImageQuestionForm: React.FC<ImageQuestionFormProps> = ({ onClose }) => {
  const [questionTitle, setQuestionTitle] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [answer, setAnswer] = useState("");
  const [letterCount, setLetterCount] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showNotification } = useGameContext();
  const queryClient = useQueryClient();

  const handleImageUpload = (url: string) => {
    setImageUrl(url);
  };

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
    
    if (!questionTitle || !answer || !letterCount || !imageUrl) {
      showNotification("يرجى ملء جميع الحقول المطلوبة", "error");
      return;
    }
    
    const letterCountNum = parseInt(letterCount);
    if (isNaN(letterCountNum)) {
      showNotification("عدد الحروف يجب أن يكون رقمًا", "error");
      return;
    }
    
    setIsSubmitting(true);
    
    // الحصول على معرف فئة "صور"
    const getCategoryId = async () => {
      try {
        const res = await fetch("/api/categories");
        const categories = await res.json();
        const imageCategory = categories.find((cat: any) => cat.name === "صور");
        if (!imageCategory) {
          showNotification("لم يتم العثور على فئة الصور", "error");
          setIsSubmitting(false);
          return;
        }
        
        // إنشاء السؤال
        const questionData = {
          categoryId: imageCategory.id,
          clue1: questionTitle,
          clue2: additionalInfo || "معلومات إضافية غير متوفرة",
          answer,
          letterCount: letterCountNum,
          imageUrl
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
        إضافة سؤال جديد للعبة الصور
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 font-bold mb-2">السؤال / التعليمات</label>
            <Textarea
              value={questionTitle}
              onChange={(e) => setQuestionTitle(e.target.value)}
              placeholder="أدخل السؤال أو التعليمات (مثال: ما اسم هذا المبنى؟)"
              className="w-full"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-bold mb-2">معلومات إضافية (اختياري)</label>
            <Textarea
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="أدخل معلومات إضافية أو تلميحات (مثال: يقع في باريس، فرنسا)"
              className="w-full"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-bold mb-2">الإجابة الصحيحة</label>
              <Input
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="الإجابة الصحيحة"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-bold mb-2">عدد حروف الإجابة</label>
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
          
          <div>
            <label className="block text-gray-700 font-bold mb-2">الصورة</label>
            <ImageUploader onImageUpload={handleImageUpload} />
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

export default ImageQuestionForm;