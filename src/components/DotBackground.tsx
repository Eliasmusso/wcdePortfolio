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

const TRAIL_LIFETIME = 1200;
const THROTTLE_DELAY = 16;
const MOUSE_INFLUENCE_RADIUS = 180;
const TRAIL_INFLUENCE_RADIUS = 160;
const TRAIL_MAX_POINTS = 30;
const HERO_RADIUS = 260;
const DOT_MARGIN = 100;
const DEFAULT_WIDTH = 1200;
const DEFAULT_HEIGHT = 800;
const OPACITY_BASE = 0.7;
const SCALE_MULTIPLIER = 1.8;
const OPACITY_BOOST = 0.6;
const HIGHLIGHT_THRESHOLD = 0.15;
const MAX_INFLUENCE_THRESHOLD = 0.99;

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

  useEffect(() => {
    const updateTrail = () => {
      const now = Date.now();
      setTrail((prev) =>
        prev.filter((point) => now - point.timestamp < TRAIL_LIFETIME)
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
      if (mouseMoveTimeoutRef.current) {
        return;
      }

      mouseMoveTimeoutRef.current = window.setTimeout(() => {
        mouseMoveTimeoutRef.current = null;
      }, THROTTLE_DELAY);

      const rect = e.currentTarget.getBoundingClientRect();
      const newPos = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      setMousePos(newPos);

      setTrail((prev) => {
        const now = Date.now();
        const filtered = prev.filter((p) => now - p.timestamp < TRAIL_LIFETIME);
        if (filtered.length === 0 || now - filtered[filtered.length - 1].timestamp > THROTTLE_DELAY) {
          const newTrail = [
            ...filtered,
            { ...newPos, timestamp: now },
          ];
          return newTrail.slice(-TRAIL_MAX_POINTS);
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

  const dots = useMemo(() => {
    const containerWidth = typeof window !== "undefined" ? window.innerWidth : DEFAULT_WIDTH;
    const containerHeight = typeof window !== "undefined" ? window.innerHeight : DEFAULT_HEIGHT;
    
    let centerX = containerWidth / 2;
    let centerY = containerHeight / 2;
    
    const h1Element = document.querySelector('.hero-heading');
    if (h1Element) {
      const rect = h1Element.getBoundingClientRect();
      centerX = rect.left + rect.width / 2;
      centerY = rect.top + rect.height / 2;
      centerX = Math.max(0, Math.min(containerWidth, centerX));
      centerY = Math.max(0, Math.min(containerHeight, centerY));
    }
    
    const dotsArray: Dot[] = [];
    const maxDistance = Math.max(containerWidth, containerHeight) * 0.8;
    const sizeBase = dotSize * 0.8;
    const sizeMultiplier = dotSize * 3.5;
    
    for (let x = -DOT_MARGIN; x < containerWidth + DOT_MARGIN; x += spacing) {
      for (let y = -DOT_MARGIN; y < containerHeight + DOT_MARGIN; y += spacing) {
        const dx = x - centerX;
        const dy = y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < HERO_RADIUS) continue;
        
        const distanceFromCutout = distance - HERO_RADIUS;
        const normalizedDistance = Math.min(distanceFromCutout / (maxDistance - HERO_RADIUS), 1);
        const calculatedSize = sizeBase + sizeMultiplier * normalizedDistance;
        
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

  const getDotStyle = useCallback(
    (dot: Dot) => {
      const baseStyle = {
        left: `${dot.x}px`,
        top: `${dot.y}px`,
        width: `${dot.size}px`,
        height: `${dot.size}px`,
        backgroundColor: dotColor,
        transform: "scale(1)",
        opacity: OPACITY_BASE,
      };

      if (!mousePos && trail.length === 0) {
        return baseStyle;
      }

      const now = Date.now();
      let maxInfluence = 0;

      if (mousePos) {
        const dx = dot.x - mousePos.x;
        const dy = dot.y - mousePos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const influence = Math.max(0, 1 - distance / MOUSE_INFLUENCE_RADIUS);
        maxInfluence = Math.max(maxInfluence, influence);
      }

      for (let i = trail.length - 1; i >= 0; i--) {
        const trailPoint = trail[i];
        const age = now - trailPoint.timestamp;
        if (age > TRAIL_LIFETIME) continue;
        
        const dx = dot.x - trailPoint.x;
        const dy = dot.y - trailPoint.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > TRAIL_INFLUENCE_RADIUS) continue;
        
        const ageFactor = Math.max(0, 1 - age / TRAIL_LIFETIME);
        const distanceInfluence = Math.max(0, 1 - distance / TRAIL_INFLUENCE_RADIUS);
        const combinedInfluence = distanceInfluence * ageFactor * 0.85;
        maxInfluence = Math.max(maxInfluence, combinedInfluence);
        
        if (maxInfluence >= MAX_INFLUENCE_THRESHOLD) break;
      }

      const scaleFactor = 1 + maxInfluence * SCALE_MULTIPLIER;
      const opacityBoost = maxInfluence * OPACITY_BOOST;

      return {
        ...baseStyle,
        backgroundColor: maxInfluence > HIGHLIGHT_THRESHOLD ? hoverColor : dotColor,
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