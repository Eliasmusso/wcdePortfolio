import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import "./DotBackground.css";

interface DotBackgroundProps {
  dotColor?: string;
  hoverColor?: string;
  dotSize?: number;
  spacing?: number;
}

interface Dot {
  x: number;
  y: number;
  id: number;
  size: number;
}

interface TrailPoint {
  x: number;
  y: number;
  timestamp: number;
}

export function DotBackground({
  dotColor = "#555555",
  hoverColor = "#e0001a",
  dotSize = 1.5,
  spacing = 20,
}: DotBackgroundProps) {
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const mouseMoveTimeoutRef = useRef<number | null>(null);

  // Trail-Animation
  useEffect(() => {
    const updateTrail = () => {
      const now = Date.now();
      setTrail((prev) =>
        prev.filter((point) => now - point.timestamp < 1200)
      );
      animationFrameRef.current = requestAnimationFrame(updateTrail);
    };
    animationFrameRef.current = requestAnimationFrame(updateTrail);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // Throttle mouse move für bessere Performance
      if (mouseMoveTimeoutRef.current) {
        return;
      }

      mouseMoveTimeoutRef.current = window.setTimeout(() => {
        mouseMoveTimeoutRef.current = null;
      }, 16); // ~60fps

      const rect = e.currentTarget.getBoundingClientRect();
      const newPos = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      setMousePos(newPos);

      setTrail((prev) => {
        const now = Date.now();
        // Begrenze Trail-Punkte auf max 30 für bessere Performance
        const filtered = prev.filter((p) => now - p.timestamp < 1200);
        if (filtered.length === 0 || now - filtered[filtered.length - 1].timestamp > 16) {
          const newTrail = [
            ...filtered,
            { ...newPos, timestamp: now },
          ];
          // Begrenze auf max 30 Punkte
          return newTrail.slice(-30);
        }
        return filtered;
      });
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    setMousePos(null);
    if (mouseMoveTimeoutRef.current) {
      clearTimeout(mouseMoveTimeoutRef.current);
      mouseMoveTimeoutRef.current = null;
    }
  }, []);

  // Dots berechnen - einfach und direkt
  const dots = useMemo(() => {
    const containerWidth = typeof window !== "undefined" ? window.innerWidth : 1200;
    const containerHeight = typeof window !== "undefined" ? window.innerHeight : 800;
    
    // Finde h1-Position
    let centerX = containerWidth / 2;
    let centerY = containerHeight / 2;
    
    const h1Element = document.querySelector('.hero-heading');
    if (h1Element) {
      const rect = h1Element.getBoundingClientRect();
      centerX = rect.left + rect.width / 2;
      centerY = rect.top + rect.height / 2;
    }
    
    const dotsArray: Dot[] = [];
    const heroRadius = 260;
    
    // Generiere Dots über den gesamten Bildschirm + Rand
    for (let x = -100; x < containerWidth + 100; x += spacing) {
      for (let y = -100; y < containerHeight + 100; y += spacing) {
        const dx = x - centerX;
        const dy = y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Skip dots im Kreis um h1
        if (distance < heroRadius) continue;
        
        // Größe basierend auf Distanz: innere Punkte kleiner, äußere größer
        const maxDistance = Math.max(containerWidth, containerHeight) * 0.8;
        const distanceFromCutout = distance - heroRadius;
        const normalizedDistance = Math.min(distanceFromCutout / (maxDistance - heroRadius), 1);
        // Invertierte Größenverteilung: kleinere Basis, größere Multiplikation für äußere Punkte
        const calculatedSize = dotSize * 0.8 + (dotSize * 3.5) * normalizedDistance;
        
        dotsArray.push({
          x,
          y,
          id: Math.floor(x / spacing) * 1000 + Math.floor(y / spacing),
          size: calculatedSize,
        });
      }
    }
    
    return dotsArray;
  }, [spacing, dotSize]);

  // Dot-Styling mit Hover-Effekt
  const getDotStyle = useCallback(
    (dot: Dot) => {
      const baseStyle = {
        left: `${dot.x}px`,
        top: `${dot.y}px`,
        width: `${dot.size}px`,
        height: `${dot.size}px`,
        backgroundColor: dotColor,
        transform: "scale(1)",
        opacity: 0.7,
      };

      if (!mousePos && trail.length === 0) {
        return baseStyle;
      }

      const now = Date.now();
      let maxInfluence = 0;

      // Maus-Einfluss
      if (mousePos) {
        const dx = dot.x - mousePos.x;
        const dy = dot.y - mousePos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const influence = Math.max(0, 1 - distance / 180);
        maxInfluence = Math.max(maxInfluence, influence);
      }

      // Trail-Einfluss - verstärkt für stärkeren Schweif
      // Optimiert: nur relevante Trail-Punkte prüfen (innerhalb des Einflussradius)
      for (let i = trail.length - 1; i >= 0; i--) {
        const trailPoint = trail[i];
        const age = now - trailPoint.timestamp;
        if (age > 1200) continue; // Skip alte Punkte
        
        const dx = dot.x - trailPoint.x;
        const dy = dot.y - trailPoint.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Early exit wenn zu weit weg
        if (distance > 160) continue;
        
        const ageFactor = Math.max(0, 1 - age / 1200);
        const distanceInfluence = Math.max(0, 1 - distance / 160);
        const combinedInfluence = distanceInfluence * ageFactor * 0.85;
        maxInfluence = Math.max(maxInfluence, combinedInfluence);
        
        // Early exit wenn bereits maximale Influence erreicht
        if (maxInfluence >= 0.99) break;
      }

      const scaleFactor = 1 + maxInfluence * 1.8;
      const opacityBoost = maxInfluence * 0.6;

      return {
        ...baseStyle,
        backgroundColor: maxInfluence > 0.15 ? hoverColor : dotColor,
        transform: `scale(${scaleFactor})`,
        opacity: Math.min(1, baseStyle.opacity + opacityBoost),
      };
    },
    [mousePos, trail, dotColor, hoverColor]
  );

  return (
    <div
      className="dot-background"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {dots.map((dot) => (
        <div
          key={dot.id}
          className="dot"
          style={getDotStyle(dot)}
        />
      ))}
    </div>
  );
}