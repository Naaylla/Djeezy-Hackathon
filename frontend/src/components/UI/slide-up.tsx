import { motion } from "framer-motion";

interface SlideUpProps {
  children: React.ReactNode;
  delay?: number;
}

export default function SlideUp({ children, delay = 0 }: SlideUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}
