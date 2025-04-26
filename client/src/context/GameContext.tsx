import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type NotificationType = "success" | "error";

interface NotificationState {
  visible: boolean;
  message: string;
  type: NotificationType;
}

interface GameContextType {
  notification: NotificationState;
  showNotification: (message: string, type?: NotificationType) => void;
  hideNotification: () => void;
  createConfetti: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [notification, setNotification] = useState<NotificationState>({
    visible: false,
    message: "",
    type: "success",
  });

  const showNotification = useCallback((message: string, type: NotificationType = "success") => {
    setNotification({
      visible: true,
      message,
      type,
    });
  }, []);

  const hideNotification = useCallback(() => {
    setNotification((prev) => ({
      ...prev,
      visible: false,
    }));
  }, []);

  const createConfetti = useCallback(() => {
    const colors = ["#FF4081", "#2196F3", "#4CAF50", "#FFEB3B", "#9C27B0"];
    const confettiCount = 100;

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement("div");
      confetti.className = "confetti";
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
      confetti.style.animationDelay = `${Math.random() * 2}s`;
      document.body.appendChild(confetti);

      setTimeout(() => {
        confetti.remove();
      }, 5000);
    }
  }, []);

  return (
    <GameContext.Provider
      value={{
        notification,
        showNotification,
        hideNotification,
        createConfetti,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
};
