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
import WhoAmIQuestionForm from "./WhoAmIQuestionForm";

const AddWhoAmIQuestionModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          className="bg-gradient-to-r from-purple-500 to-indigo-700 text-white mb-4 hover:from-purple-600 hover:to-indigo-800 shadow-lg"
          size="lg"
        >
          <i className="fas fa-user-secret ml-2"></i> إضافة سؤال جديد للعبة من أنا
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl" onEscapeKeyDown={handleClose}>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">لعبة من أنا</DialogTitle>
          <DialogDescription>
            أضف 6 معلومات عن الشخصية المطلوب التعرف عليها
          </DialogDescription>
        </DialogHeader>
        <WhoAmIQuestionForm onClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
};

export default AddWhoAmIQuestionModal;