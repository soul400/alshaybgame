import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { parseExcelFile } from "@/lib/excelParser";
import { useGameContext } from "@/context/GameContext";

const DataImport = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showNotification } = useGameContext();

  // Mutation to upload Excel data
  const uploadMutation = useMutation({
    mutationFn: async (data: any[]) => {
      const res = await apiRequest("POST", "/api/questions/bulk?clear=true", data);
      return res.json();
    },
    onSuccess: (data) => {
      showNotification(`تم استيراد ${data.count} سؤال بنجاح`);
      setIsUploading(false);
      setUploadError(null);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    onError: (error) => {
      console.error("Error uploading Excel data:", error);
      setUploadError("حدث خطأ أثناء استيراد الملف. تأكد من تنسيق الملف وحاول مرة أخرى.");
      setIsUploading(false);
      showNotification("فشل في استيراد الأسئلة", "error");
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file extension
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (fileExtension !== 'xlsx' && fileExtension !== 'xls') {
      setUploadError("يرجى اختيار ملف Excel صالح (.xlsx أو .xls)");
      return;
    }

    try {
      setIsUploading(true);
      setUploadError(null);
      
      // Parse Excel file
      const data = await parseExcelFile(file);
      
      // Upload data to server
      uploadMutation.mutate(data);
    } catch (error) {
      console.error("Error parsing Excel file:", error);
      setUploadError("حدث خطأ أثناء قراءة الملف. تأكد من تنسيق الملف وحاول مرة أخرى.");
      setIsUploading(false);
      showNotification("فشل في قراءة ملف Excel", "error");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-center border-b border-gray-200 pb-4 mb-4">
        استيراد الأسئلة
      </h2>

      <div className="flex flex-col items-center justify-center">
        <label className="w-full flex flex-col items-center px-4 py-6 bg-neutral text-primary rounded-lg shadow-lg tracking-wide border border-dashed border-primary cursor-pointer hover:bg-neutral/80 transition">
          {isUploading ? (
            <>
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
              <span className="text-lg">جاري الاستيراد...</span>
            </>
          ) : (
            <>
              <i className="fas fa-file-excel text-5xl mb-2"></i>
              <span className="text-lg">اختر ملف Excel</span>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".xlsx, .xls"
                onChange={handleFileChange}
                disabled={isUploading}
              />
            </>
          )}
        </label>

        {uploadError && (
          <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-md">
            <p>{uploadError}</p>
          </div>
        )}

        <div className="mt-6 text-sm text-gray-600">
          <p className="font-bold mb-2">تنسيق الملف المطلوب:</p>
          <ul className="list-disc mr-6 space-y-1">
            <li>يجب أن يحتوي الملف على الأعمدة التالية: category, clue1, clue2, answer, letterCount</li>
            <li>category: اسم فئة اللعبة (مثال: بحر حرب، تنقيص حرف، إلخ)</li>
            <li>clue1: التلميح الأول للسؤال</li>
            <li>clue2: التلميح الثاني للسؤال</li>
            <li>answer: الإجابة الصحيحة</li>
            <li>letterCount: عدد حروف الإجابة</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DataImport;
