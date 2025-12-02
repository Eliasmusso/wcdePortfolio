import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const totalDuration = 3000; // 3 Sekunden Gesamtdauer
    const progressDuration = 2700; // 2.7 Sekunden bis 100% (90% der Gesamtdauer)
    const interval = 16; // ~60fps
    const steps = progressDuration / interval;
    const increment = 100 / steps;

    let currentProgress = 0;
    const startTime = Date.now();
    
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      
      if (elapsed >= progressDuration) {
        // Bei 2.7 Sekunden: 100% erreicht
        currentProgress = 100;
        setProgress(100);
        
        // Warte bis 3 Sekunden, dann ausblenden
        if (elapsed >= totalDuration) {
          clearInterval(timer);
          setTimeout(() => {
            setIsVisible(false);
            setTimeout(onComplete, 500); // Warte auf Fade-Out
          }, 200);
        }
      } else {
        // Progress bis 2.7 Sekunden
        currentProgress += increment;
        setProgress(Math.min(currentProgress, 100));
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  // Berechne die Position des Balkens (in Prozent der Bildschirmbreite)
  // Der Balken wächst von 0% zu 100%, daher ist seine Position = progress
  const barPosition = progress;
  
  // Die Zahl ist oben rechts, daher wird sie schwarz, wenn der Balken ~85-90% erreicht
  // (um zu berücksichtigen, dass die Zahl rechts positioniert ist)
  const numberPosition = 88; // Position der Zahl in Prozent (oben rechts)
  const fontReached = barPosition >= numberPosition;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Roter Ladebalken - obere 20%, wächst von links (0%) nach rechts (100%) */}
          <div
            className="loading-bar"
            style={{ width: `${progress}%` }}
          />

          {/* Zahl oben rechts - fixiert */}
          <div className="loading-number">
            <span 
              className={fontReached ? "loading-number-black" : "loading-number-white"}
              style={{
                transition: "color 0.1s ease"
              }}
            >
              ({Math.round(progress)})
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

