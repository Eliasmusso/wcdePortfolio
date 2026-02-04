import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LOADING_PROGRESS_VAR = "--loading-progress";

interface LoadingScreenProps {
  onComplete: () => void;
}

const TOTAL_DURATION = 3000;
const PROGRESS_DURATION = 2700;
const FADE_OUT_DELAY = 200;
const COMPLETE_DELAY = 500;

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const lastRoundedRef = useRef(-1);

  useEffect(() => {
    startTimeRef.current = performance.now();
    lastRoundedRef.current = -1;

    const animate = (currentTime: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = currentTime;
      }

      const elapsed = currentTime - startTimeRef.current;
      const progressPercent = Math.min(
        elapsed >= PROGRESS_DURATION ? 100 : (elapsed / PROGRESS_DURATION) * 100,
        100
      );
      const rounded = Math.floor(progressPercent);

      // Bar: drive via CSS variable (no re-render, GPU-friendly transform in CSS)
      document.documentElement.style.setProperty(
        LOADING_PROGRESS_VAR,
        String(progressPercent / 100)
      );

      // Number: only update state when integer changes to reduce re-renders on mobile
      if (rounded !== lastRoundedRef.current) {
        lastRoundedRef.current = rounded;
        setDisplayProgress(progressPercent);
      }

      if (elapsed >= PROGRESS_DURATION) {
        setDisplayProgress(100);

        if (elapsed >= TOTAL_DURATION) {
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
          }
          document.documentElement.style.removeProperty(LOADING_PROGRESS_VAR);
          setTimeout(() => {
            setIsVisible(false);
            setTimeout(onComplete, COMPLETE_DELAY);
          }, FADE_OUT_DELAY);
          return;
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      document.documentElement.style.removeProperty(LOADING_PROGRESS_VAR);
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
          <div className="loading-bar" />
          <div className="loading-number">
            <span className="loading-number-white">
              ({Math.round(displayProgress)})
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}