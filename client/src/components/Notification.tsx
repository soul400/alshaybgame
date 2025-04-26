import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameContext } from "@/context/GameContext";

const Notification = () => {
  const { notification, hideNotification } = useGameContext();

  // Auto-hide notification after 3 seconds
  useEffect(() => {
    if (notification.visible) {
      const timer = setTimeout(() => {
        hideNotification();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [notification.visible, hideNotification]);

  return (
    <AnimatePresence>
      {notification.visible && (
        <motion.div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 py-2 px-4 rounded-lg shadow-lg z-50 ${
            notification.type === "error"
              ? "bg-destructive text-white"
              : "bg-secondary text-white"
          }`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <span>{notification.message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;
