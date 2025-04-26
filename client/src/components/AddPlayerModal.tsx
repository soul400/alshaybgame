import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useGameContext } from "@/context/GameContext";

interface AddPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddPlayerModal = ({ isOpen, onClose }: AddPlayerModalProps) => {
  const [playerName, setPlayerName] = useState("");
  const queryClient = useQueryClient();
  const { showNotification } = useGameContext();

  // Add player mutation
  const addPlayerMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await apiRequest("POST", "/api/players", { name, score: 0 });
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/players"] });
      showNotification(`تمت إضافة اللاعب ${data.name}`);
      setPlayerName("");
      onClose();
    },
    onError: (error) => {
      console.error("Error adding player:", error);
      showNotification("فشل في إضافة اللاعب", "error");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      addPlayerMutation.mutate(playerName.trim());
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            إضافة لاعب جديد
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="playerName" className="block text-lg font-medium mb-2">
              اسم اللاعب
            </label>
            <Input
              id="playerName"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-secondary focus:border-secondary"
              placeholder="أدخل اسم اللاعب"
              autoComplete="off"
            />
          </div>

          <DialogFooter className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="bg-[#333333] text-white hover:bg-[#333333]/80"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              className="bg-accent text-white hover:bg-accent/80"
              disabled={!playerName.trim() || addPlayerMutation.isPending}
            >
              {addPlayerMutation.isPending ? "جاري الإضافة..." : "إضافة"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPlayerModal;
