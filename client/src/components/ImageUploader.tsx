import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useGameContext } from "@/context/GameContext";

interface ImageUploaderProps {
  onImageUpload: (imageUrl: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showNotification } = useGameContext();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // التحقق من أن الملف هو صورة
    if (!file.type.match('image.*')) {
      showNotification('يرجى اختيار ملف صورة صالح (jpg, png, gif, إلخ)', 'error');
      return;
    }

    setIsUploading(true);

    // إنشاء URL للصورة المحلية
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      setPreview(imageUrl);
      onImageUpload(imageUrl);
      setIsUploading(false);
    };

    reader.onerror = () => {
      showNotification('حدث خطأ أثناء قراءة الملف', 'error');
      setIsUploading(false);
    };

    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mb-6">
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h3 className="text-lg font-bold mb-4 text-center">تحميل صورة</h3>
        
        {preview ? (
          <div className="mb-4">
            <div className="flex justify-center">
              <img
                src={preview}
                alt="معاينة الصورة"
                className="max-w-full max-h-[300px] rounded-lg shadow-md object-contain"
              />
            </div>
            <div className="flex justify-center mt-4">
              <Button
                onClick={triggerFileInput}
                variant="outline"
                className="text-sm"
              >
                <i className="fas fa-sync-alt ml-2"></i> تغيير الصورة
              </Button>
            </div>
          </div>
        ) : (
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition"
            onClick={triggerFileInput}
          >
            <i className="fas fa-cloud-upload-alt text-gray-400 text-4xl mb-3"></i>
            <p className="text-gray-500">اضغط لاختيار صورة أو قم بسحب وإفلات الصورة هنا</p>
            <p className="text-xs text-gray-400 mt-2">JPG, PNG, GIF حتى 5MB</p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading}
        />

        {isUploading && (
          <div className="text-center mt-4">
            <div className="inline-block w-8 h-8 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
            <p className="text-sm text-gray-500 mt-2">جاري رفع الصورة...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;