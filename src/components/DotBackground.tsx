import { useEffect, useRef, useCallback } from "react";
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
  baseSize: number;
  currentSize: number;
  targetSize: number;
  currentOpacity: number;
  targetOpacity: number;
  isHighlighted: boolean;
}

interface TrailPoint {
  x: number;
  y: number;
  timestamp: number;
}

const TRAIL_LIFETIME = 600;
const MOUSE_INFLUENCE_RADIUS = 120;
const TRAIL_INFLUENCE_RADIUS = 100;
const TRAIL_MAX_POINTS = 20;
const DOT_MARGIN = 50;

// Dynamic hero radius based on viewport
const getHeroRadius = () => {
  if (typeof window === 'undefined') return 260;
  return window.innerWidth <= 768 ? 140 : 260;
};
const OPACITY_BASE = 0.7;
const SCALE_MULTIPLIER = 2.0;
const LERP_SPEED = 0.15;

export function DotBackground({
  dotColor = "#555555",
  hoverColor = "#e0001a",
  dotSize = 1.5,
  spacing = 22,
}: DotBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const mousePosRef = useRef<{ x: number; y: number } | null>(null);
  const trailRef = useRef<TrailPoint[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Lerp function for smooth interpolation
  const lerp = (start: number, end: number, factor: number) => {
    return start + (end - start) * factor;
  };

  // Initialize dots
  const initDots = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const containerWidth = canvas.width;
    const containerHeight = canvas.height;
    
    // Get dynamic hero radius based on viewport
    const heroRadius = getHeroRadius();
    
    let centerX = containerWidth / 2;
    let centerY = containerHeight / 2;
    
    const h1Element = document.querySelector('.hero-heading');
    if (h1Element) {
      const rect = h1Element.getBoundingClientRect();
      centerX = rect.left + rect.width / 2;
      centerY = rect.top + rect.height / 2;
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
        
        if (distance < heroRadius) continue;
        
        const distanceFromCutout = distance - heroRadius;
        const normalizedDistance = Math.min(distanceFromCutout / (maxDistance - heroRadius), 1);
        const calculatedSize = sizeBase + sizeMultiplier * normalizedDistance;
        
        dotsArray.push({
          x,
          y,
          baseSize: calculatedSize,
          currentSize: calculatedSize,
          targetSize: calculatedSize,
          currentOpacity: OPACITY_BASE,
          targetOpacity: OPACITY_BASE,
          isHighlighted: false,
        });
      }
    }
    
    dotsRef.current = dotsArray;
  }, [spacing, dotSize]);

  // Update dot targets based on mouse position
  const updateDotTargets = useCallback(() => {
    const dots = dotsRef.current;
    const mousePos = mousePosRef.current;
    const trail = trailRef.current;
    const now = Date.now();

    // Clean old trail points
    trailRef.current = trail.filter(p => now - p.timestamp < TRAIL_LIFETIME);

    for (const dot of dots) {
      let maxInfluence = 0;

      // Mouse influence
      if (mousePos) {
        const dx = dot.x - mousePos.x;
        const dy = dot.y - mousePos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const influence = Math.max(0, 1 - distance / MOUSE_INFLUENCE_RADIUS);
        maxInfluence = Math.max(maxInfluence, influence);
      }

      // Trail influence
      for (const trailPoint of trailRef.current) {
        const age = now - trailPoint.timestamp;
        const dx = dot.x - trailPoint.x;
        const dy = dot.y - trailPoint.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > TRAIL_INFLUENCE_RADIUS) continue;
        
        const ageFactor = Math.max(0, 1 - age / TRAIL_LIFETIME);
        const distanceInfluence = Math.max(0, 1 - distance / TRAIL_INFLUENCE_RADIUS);
        const combinedInfluence = distanceInfluence * ageFactor * 0.9;
        maxInfluence = Math.max(maxInfluence, combinedInfluence);
      }

      // Set targets
      dot.targetSize = dot.baseSize * (1 + maxInfluence * SCALE_MULTIPLIER);
      dot.targetOpacity = Math.min(1, OPACITY_BASE + maxInfluence * 0.5);
      dot.isHighlighted = maxInfluence > 0.1;
    }
  }, []);

  // Render loop
  const render = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) {
      animationFrameRef.current = requestAnimationFrame(render);
      return;
    }

    // Delta time for consistent animation speed
    const deltaTime = Math.min((timestamp - lastTimeRef.current) / 16.67, 2);
    lastTimeRef.current = timestamp;

    // Update targets
    updateDotTargets();

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Parse colors
    const baseColor = dotColor;
    const highlightColor = hoverColor;

    // Draw dots with smooth interpolation
    for (const dot of dotsRef.current) {
      // Smooth interpolation
      dot.currentSize = lerp(dot.currentSize, dot.targetSize, LERP_SPEED * deltaTime);
      dot.currentOpacity = lerp(dot.currentOpacity, dot.targetOpacity, LERP_SPEED * deltaTime);

      // Draw dot
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, dot.currentSize / 2, 0, Math.PI * 2);
      ctx.fillStyle = dot.isHighlighted ? highlightColor : baseColor;
      ctx.globalAlpha = dot.currentOpacity;
      ctx.fill();
    }

    ctx.globalAlpha = 1;

    animationFrameRef.current = requestAnimationFrame(render);
  }, [dotColor, hoverColor, updateDotTargets]);

  // Handle mouse move
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const newPos = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    
    mousePosRef.current = newPos;

    // Add to trail
    const now = Date.now();
    const trail = trailRef.current;
    if (trail.length === 0 || now - trail[trail.length - 1].timestamp > 20) {
      trailRef.current = [...trail.slice(-TRAIL_MAX_POINTS + 1), { ...newPos, timestamp: now }];
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    mousePosRef.current = null;
  }, []);

  // Handle touch move
  const handleTouchMove = useCallback((e: TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || e.touches.length === 0) return;

    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const newPos = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };
    
    mousePosRef.current = newPos;

    // Add to trail
    const now = Date.now();
    const trail = trailRef.current;
    if (trail.length === 0 || now - trail[trail.length - 1].timestamp > 20) {
      trailRef.current = [...trail.slice(-TRAIL_MAX_POINTS + 1), { ...newPos, timestamp: now }];
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    mousePosRef.current = null;
  }, []);

  // Setup canvas and event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      initDots();
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Start animation loop
    lastTimeRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(render);

    // Add event listeners
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    // Touch support
    canvas.addEventListener('touchmove', handleTouchMove, { passive: true });
    canvas.addEventListener('touchend', handleTouchEnd);
    canvas.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      // Touch cleanup
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      canvas.removeEventListener('touchcancel', handleTouchEnd);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [initDots, render, handleMouseMove, handleMouseLeave, handleTouchMove, handleTouchEnd]);

  return (
    <canvas
      ref={canvasRef}
      className="dot-background"
    />
  );
}
