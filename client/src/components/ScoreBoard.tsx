import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import AddPlayerModal from "./AddPlayerModal";
import { apiRequest } from "@/lib/queryClient";
import { useGameContext } from "@/context/GameContext";

const ScoreBoard = () => {
  const [isAddPlayerModalOpen, setIsAddPlayerModalOpen] = useState(false);
  const [_, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { showNotification } = useGameContext();

  // Fetch players from API
  const { data: players, isLoading } = useQuery({
    queryKey: ["/api/players"],
  });

  // Mutation to increase player score
  const increaseScoreMutation = useMutation({
    mutationFn: async ({ id, score }: { id: number; score: number }) => {
      const res = await apiRequest("PATCH", `/api/players/${id}/score`, { score: score + 1 });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/players"] });
    },
  });

  // Mutation to decrease player score
  const decreaseScoreMutation = useMutation({
    mutationFn: async ({ id, score }: { id: number; score: number }) => {
      const res = await apiRequest("PATCH", `/api/players/${id}/score`, { score: Math.max(0, score - 1) });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/players"] });
    },
  });

  // Mutation to reset all scores
  const resetScoresMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/players/reset-scores", {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/players"] });
      showNotification("تم إعادة ضبط النتائج");
    },
  });

  // Mutation to delete a player
  const deletePlayerMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/players/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/players"] });
      showNotification("تم حذف اللاعب");
    },
  });

  const handleResetScores = () => {
    if (window.confirm("هل أنت متأكد من إعادة ضبط جميع النتائج؟")) {
      resetScoresMutation.mutate();
    }
  };

  const handleDeletePlayer = (id: number) => {
    if (window.confirm("هل أنت متأكد من حذف هذا اللاعب؟")) {
      deletePlayerMutation.mutate(id);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-center border-b border-gray-200 pb-4 mb-4">
        لوحة النتائج
      </h2>

      <div className="flex justify-end mb-4">
        <Button 
          onClick={() => setIsAddPlayerModalOpen(true)} 
          variant="default" 
          className="bg-accent text-white hover:bg-accent/80"
        >
          <i className="fas fa-plus ml-2"></i> إضافة لاعب
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-right">اللاعب</th>
              <th className="p-3 text-center">النقاط</th>
              <th className="p-3 text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              // Loading skeleton
              Array(3).fill(0).map((_, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="p-3">
                    <div className="h-6 bg-gray-200 rounded animate-pulse w-24"></div>
                  </td>
                  <td className="p-3 text-center">
                    <div className="h-6 bg-gray-200 rounded animate-pulse w-8 mx-auto"></div>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center space-x-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                      <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                      <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                    </div>
                  </td>
                </tr>
              ))
            ) : players && players.length > 0 ? (
              // Players list
              players.map((player) => (
                <tr key={player.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-3 text-right">
                    <span className="font-medium">{player.name}</span>
                  </td>
                  <td className="p-3 text-center">
                    <span className="bg-primary text-white py-1 px-3 rounded-full">
                      {player.score}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      className="bg-accent text-white rounded-full w-8 h-8 mx-1 hover:bg-accent/80 transition"
                      onClick={() => increaseScoreMutation.mutate({ id: player.id, score: player.score })}
                      disabled={increaseScoreMutation.isPending}
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                    <button
                      className="bg-destructive text-white rounded-full w-8 h-8 mx-1 hover:bg-destructive/80 transition"
                      onClick={() => decreaseScoreMutation.mutate({ id: player.id, score: player.score })}
                      disabled={decreaseScoreMutation.isPending || player.score <= 0}
                    >
                      <i className="fas fa-minus"></i>
                    </button>
                    <button
                      className="bg-gray-500 text-white rounded-full w-8 h-8 mx-1 hover:bg-gray-600 transition"
                      onClick={() => handleDeletePlayer(player.id)}
                      disabled={deletePlayerMutation.isPending}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              // Empty state
              <tr>
                <td colSpan={3} className="p-8 text-center text-gray-500">
                  لا يوجد لاعبين حتى الآن. قم بإضافة لاعبين للبدء في اللعب.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between mt-6">
        <Button
          onClick={handleResetScores}
          variant="destructive"
          disabled={resetScoresMutation.isPending || !players || players.length === 0}
        >
          <i className="fas fa-trash ml-2"></i> إعادة ضبط النتائج
        </Button>

        <Button
          onClick={() => setLocation("/penalty")}
          variant="default"
          className="bg-warning text-[#333333] hover:bg-warning/80"
          disabled={!players || players.length === 0}
        >
          <i className="fas fa-exclamation-triangle ml-2"></i> نظام العقاب
        </Button>
      </div>

      {/* Add Player Modal */}
      <AddPlayerModal
        isOpen={isAddPlayerModalOpen}
        onClose={() => setIsAddPlayerModalOpen(false)}
      />
    </div>
  );
};

export default ScoreBoard;
