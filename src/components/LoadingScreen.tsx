import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingScreenProps {
  onComplete: () => void;
}

const TOTAL_DURATION = 3000;
const PROGRESS_DURATION = 2700;
const FADE_OUT_DELAY = 200;
const COMPLETE_DELAY = 500;

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    startTimeRef.current = performance.now();

    const animate = (currentTime: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = currentTime;
      }

      const elapsed = currentTime - startTimeRef.current;

      if (elapsed >= PROGRESS_DURATION) {
        setProgress(100);

        if (elapsed >= TOTAL_DURATION) {
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
          }
          setTimeout(() => {
            setIsVisible(false);
            setTimeout(onComplete, COMPLETE_DELAY);
          }, FADE_OUT_DELAY);
          return;
        }
      } else {
        const progressPercent = (elapsed / PROGRESS_DURATION) * 100;
        setProgress(Math.min(progressPercent, 100));
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <div
            className="loading-bar"
            style={{ width: `${progress}%` }}
          />
          <div className="loading-number">
            <span className="loading-number-white">
              ({Math.round(progress)})
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}