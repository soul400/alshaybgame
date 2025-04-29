import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CompleteProverbQuestionForm from "./CompleteProverbQuestionForm";

const AddCompleteProverbQuestionModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white mb-4 hover:from-yellow-600 hover:to-amber-700 shadow-lg"
          size="lg"
        >
          <i className="fas fa-quote-right ml-2"></i> إضافة سؤال جديد للعبة أكمل المثل
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl" onEscapeKeyDown={handleClose}>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">لعبة أكمل المثل</DialogTitle>
          <DialogDescription>
            أضف مثلاً جديداً مع تحديد الكلمة المفقودة التي يجب على المتسابق معرفتها
          </DialogDescription>
        </DialogHeader>
        <CompleteProverbQuestionForm onClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
};

export default AddCompleteProverbQuestionModal;