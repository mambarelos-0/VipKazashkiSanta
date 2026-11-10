import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface Props {
  children: ReactNode;
  delay?: number;
  from?: "up" | "down" | "left" | "right";
  className?: string;
}

/** Блок, который плавно «приплывает» на своё место */
export function Float({ children, delay = 0, from = "down", className }: Props) {
  const off = 46;
  const x = from === "left" ? -off : from === "right" ? off : 0;
  const y = from === "down" ? off : from === "up" ? -off : 0;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x, y, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      transition={{ duration: 1.1, delay: 0.55 + delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
