import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ImageQuestionForm from "./ImageQuestionForm";
import { motion } from "framer-motion";

const AddImageQuestionModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          className="bg-gradient-to-r from-red-500 to-pink-600 text-white mb-4 hover:from-red-600 hover:to-pink-700 shadow-lg"
          size="lg"
        >
          <i className="fas fa-image ml-2"></i> إضافة سؤال جديد للعبة الصور
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl" onEscapeKeyDown={handleClose}>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">لعبة الصور</DialogTitle>
        </DialogHeader>
        <ImageQuestionForm onClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
};

export default AddImageQuestionModal;