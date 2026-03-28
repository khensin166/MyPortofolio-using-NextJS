import { ChatRoom } from "./ChatRoom";
import ChatWidgetHeader from "./ChatWidgetHeader";
import { AnimatePresence, motion } from "framer-motion";

const ChatWidget = () => {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-24 right-6 w-[450px] rounded-lg border border-border bg-card/80 backdrop-blur-sm"
        initial={{ opacity: 0, scale: 0, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        <ChatWidgetHeader />
        <ChatRoom isWidget={true} />
      </motion.div>
    </AnimatePresence>
  );
};

export default ChatWidget;
