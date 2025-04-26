import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useGameContext } from "@/context/GameContext";

interface GameScoreUpdaterProps {
  onNextQuestion: () => void;
}

const GameScoreUpdater = ({ onNextQuestion }: GameScoreUpdaterProps) => {
  const queryClient = useQueryClient();
  const { showNotification } = useGameContext();

  // Fetch players
  const { data: players, isLoading } = useQuery({
    queryKey: ["/api/players"],
  });

  // Mutation to increase player score
  const increaseScoreMutation = useMutation({
    mutationFn: async ({ id, score }: { id: number; score: number }) => {
      const res = await apiRequest("PATCH", `/api/players/${id}/score`, { score: score + 1 });
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/players"] });
      showNotification(`تم تسجيل نقطة لـ ${data.name}!`);
    },
  });

  // Handler for when a player wins the round
  const handleWin = (playerId: number, playerName: string, currentScore: number) => {
    increaseScoreMutation.mutate({ id: playerId, score: currentScore });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-2xl font-bold text-center mb-4">تسجيل النقاط</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {isLoading ? (
          // Loading skeleton
          Array(3).fill(0).map((_, index) => (
            <div key={index} className="bg-neutral p-4 rounded-lg flex justify-between items-center animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-24"></div>
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            </div>
          ))
        ) : players && players.length > 0 ? (
          // Players list
          players.map((player) => (
            <div key={player.id} className="bg-neutral p-4 rounded-lg flex justify-between items-center">
              <span className="font-bold">{player.name}</span>
              <div>
                <button
                  className="score-win-btn bg-accent text-white rounded-full w-8 h-8 mx-1 hover:bg-accent/80 transition"
                  onClick={() => handleWin(player.id, player.name, player.score)}
                  disabled={increaseScoreMutation.isPending}
                >
                  <i className="fas fa-trophy"></i>
                </button>
              </div>
            </div>
          ))
        ) : (
          // Empty state
          <div className="col-span-full text-center p-4 text-gray-500">
            لا يوجد لاعبين. أضف لاعبين من الصفحة الرئيسية.
          </div>
        )}
      </div>

      <div className="text-center">
        <Button onClick={onNextQuestion} size="lg" className="px-6 py-6">
          <i className="fas fa-forward ml-2"></i> السؤال التالي
        </Button>
      </div>
    </div>
  );
};

export default GameScoreUpdater;
