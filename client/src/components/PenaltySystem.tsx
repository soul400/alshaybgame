import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/queryClient";
import { useGameContext } from "@/context/GameContext";
import { playConfettiSound } from "@/lib/soundEffects";

const PenaltySystem = () => {
  const [penaltyText, setPenaltyText] = useState("");
  const [selectedPenalty, setSelectedPenalty] = useState<string | null>(null);
  const [selectedLoser, setSelectedLoser] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { showNotification, createConfetti } = useGameContext();

  // Fetch penalties
  const { data: penalties, isLoading: isPenaltiesLoading } = useQuery({
    queryKey: ["/api/penalties"],
  });

  // Fetch players
  const { data: players, isLoading: isPlayersLoading } = useQuery({
    queryKey: ["/api/players"],
  });

  // Sort players by score (ascending) to get losers first
  const sortedPlayers = players
    ? [...players].sort((a, b) => a.score - b.score)
    : [];

  // Get all players except the one with highest score
  const losers = sortedPlayers.length > 1
    ? sortedPlayers.slice(0, -1)
    : sortedPlayers;

  // Add penalty mutation
  const addPenaltyMutation = useMutation({
    mutationFn: async (description: string) => {
      const res = await apiRequest("POST", "/api/penalties", { description });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/penalties"] });
      setPenaltyText("");
      showNotification("تمت إضافة العقوبة");
    },
  });

  // Delete penalty mutation
  const deletePenaltyMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/penalties/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/penalties"] });
      showNotification("تم حذف العقوبة");
    },
  });

  // Handle adding a new penalty
  const handleAddPenalty = () => {
    if (penaltyText.trim()) {
      addPenaltyMutation.mutate(penaltyText.trim());
    }
  };

  // Handle deleting a penalty
  const handleDeletePenalty = (id: number) => {
    deletePenaltyMutation.mutate(id);
  };

  // Handle selecting a random penalty and loser
  const handleSelectRandomPenalty = () => {
    if (!penalties || penalties.length === 0 || !losers || losers.length === 0) {
      showNotification("يجب إضافة عقوبات ولاعبين أولاً", "error");
      return;
    }

    // Select random penalty
    const randomPenaltyIndex = Math.floor(Math.random() * penalties.length);
    const penalty = penalties[randomPenaltyIndex];

    // Select random loser
    const randomLoserIndex = Math.floor(Math.random() * losers.length);
    const loser = losers[randomLoserIndex];

    setSelectedPenalty(penalty.description);
    setSelectedLoser(loser.name);
    
    // Visual and sound effects
    createConfetti();
    playConfettiSound();
    showNotification("تم اختيار العقوبة واللاعب!");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Penalties Management */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-2xl font-bold text-center border-b border-gray-200 pb-4 mb-4">
          إضافة عقوبات
        </h3>

        <div className="mb-4">
          <Textarea
            id="penaltyInput"
            value={penaltyText}
            onChange={(e) => setPenaltyText(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-secondary focus:border-secondary"
            rows={6}
            placeholder="اكتب العقوبة هنا..."
          />
        </div>

        <Button
          id="addPenaltyBtn"
          onClick={handleAddPenalty}
          className="w-full bg-secondary text-white py-6 rounded-lg hover:bg-secondary/80 transition"
          disabled={!penaltyText.trim() || addPenaltyMutation.isPending}
        >
          <i className="fas fa-plus ml-2"></i> إضافة عقوبة
        </Button>

        <div className="mt-4">
          <h4 className="text-lg font-medium mb-2">العقوبات المضافة:</h4>
          <ul className="bg-neutral rounded-lg p-3 max-h-64 overflow-y-auto">
            {isPenaltiesLoading ? (
              // Loading skeleton
              Array(3)
                .fill(0)
                .map((_, index) => (
                  <li
                    key={index}
                    className="py-2 px-3 bg-white rounded mb-2 flex justify-between items-center animate-pulse"
                  >
                    <div className="h-5 bg-gray-200 rounded w-4/5"></div>
                    <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
                  </li>
                ))
            ) : penalties && penalties.length > 0 ? (
              // Penalties list
              penalties.map((penalty) => (
                <li
                  key={penalty.id}
                  className="py-2 px-3 bg-white rounded mb-2 flex justify-between items-center"
                >
                  <span>{penalty.description}</span>
                  <button
                    className="text-destructive hover:text-destructive/80"
                    onClick={() => handleDeletePenalty(penalty.id)}
                    disabled={deletePenaltyMutation.isPending}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </li>
              ))
            ) : (
              // Empty state
              <li className="py-4 px-3 text-center text-gray-500">
                لا توجد عقوبات مضافة بعد.
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Penalty Application */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-2xl font-bold text-center border-b border-gray-200 pb-4 mb-4">
          تطبيق العقوبات
        </h3>

        <div className="mb-6">
          <h4 className="text-lg font-medium mb-2">اللاعبون المهزومون:</h4>
          <div className="bg-neutral rounded-lg p-3">
            {isPlayersLoading ? (
              // Loading skeleton
              Array(2)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="py-2 px-3 bg-white rounded mb-2 flex justify-between items-center animate-pulse"
                  >
                    <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                    <div className="flex">
                      <div className="bg-gray-200 rounded h-6 w-16 ml-2"></div>
                      <div className="w-5 h-5 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))
            ) : losers && losers.length > 0 ? (
              // Losers list
              losers.map((player) => (
                <div
                  key={player.id}
                  className="py-2 px-3 bg-white rounded mb-2 flex justify-between items-center"
                >
                  <span>{player.name}</span>
                  <div className="flex">
                    <span className="bg-primary text-white text-sm py-1 px-2 rounded ml-2">
                      {player.score} نقاط
                    </span>
                  </div>
                </div>
              ))
            ) : (
              // Empty state
              <div className="py-4 px-3 text-center text-gray-500">
                لا يوجد لاعبين بعد.
              </div>
            )}
          </div>
        </div>

        <Button
          onClick={handleSelectRandomPenalty}
          className="w-full bg-warning text-[#333333] py-6 rounded-lg font-bold hover:bg-warning/80 transition mb-4"
          disabled={!penalties?.length || !losers?.length}
        >
          <i className="fas fa-random ml-2"></i> اختيار عقوبة عشوائية
        </Button>

        {selectedPenalty && selectedLoser && (
          <div className="text-center">
            <div className="bg-secondary text-white p-4 rounded-lg">
              <h4 className="text-xl font-bold mb-2">العقوبة المختارة</h4>
              <p className="text-2xl font-bold mb-2">{selectedPenalty}</p>
              <p className="text-lg">يجب تنفيذها بواسطة:</p>
              <p className="text-2xl font-bold mt-2">{selectedLoser}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PenaltySystem;
