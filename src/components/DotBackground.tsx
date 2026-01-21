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
const MOUSE_INFLUENCE_RADIUS = 140;
const TRAIL_INFLUENCE_RADIUS = 120;
const TRAIL_MAX_POINTS = 25;
const DOT_MARGIN = 50;

// Dynamic hero radius based on viewport
const getHeroRadius = () => {
  if (typeof window === 'undefined') return 260;
  return window.innerWidth <= 768 ? 140 : 260;
};
const OPACITY_BASE = 0.7;
const SCALE_MULTIPLIER = 2.2;
const LERP_SPEED = 0.28; // Increased for smoother animation

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

  // Smooth exponential lerp function for fluid animation
  const lerp = (start: number, end: number, factor: number) => {
    // Use exponential interpolation for smoother, more natural movement
    const diff = end - start;
    // Clamp factor to prevent overshooting
    const clampedFactor = Math.min(factor, 1);
    return start + diff * clampedFactor;
  };

  // Initialize dots
  const initDots = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const containerWidth = canvas.width;
    const containerHeight = canvas.height;
    const dpr = window.devicePixelRatio || 1;
    
    // Get dynamic hero radius based on viewport (in device pixels)
    const heroRadius = getHeroRadius() * dpr;
    
    // Always center the circle in the middle of the canvas
    const centerX = containerWidth / 2;
    const centerY = containerHeight / 2;
    
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
      // Smooth interpolation with adaptive speed based on deltaTime
      const lerpFactor = LERP_SPEED * Math.min(deltaTime, 1.5);
      dot.currentSize = lerp(dot.currentSize, dot.targetSize, lerpFactor);
      dot.currentOpacity = lerp(dot.currentOpacity, dot.targetOpacity, lerpFactor);

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
    const dpr = window.devicePixelRatio || 1;
    
    // Calculate position relative to canvas in device pixels
    const newPos = {
      x: (e.clientX - rect.left) * dpr,
      y: (e.clientY - rect.top) * dpr,
    };
    
    mousePosRef.current = newPos;

    // Add to trail with higher frequency for smoother animation
    const now = Date.now();
    const trail = trailRef.current;
    if (trail.length === 0 || now - trail[trail.length - 1].timestamp > 10) {
      trailRef.current = [...trail.slice(-TRAIL_MAX_POINTS + 1), { ...newPos, timestamp: now }];
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    mousePosRef.current = null;
  }, []);

  // Handle touch start
  const handleTouchStart = useCallback((e: TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || e.touches.length === 0) return;

    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const dpr = window.devicePixelRatio || 1;
    
    // Calculate position relative to canvas in device pixels
    // canvas.width/height are in device pixels, rect.width/height are in CSS pixels
    const newPos = {
      x: (touch.clientX - rect.left) * dpr,
      y: (touch.clientY - rect.top) * dpr,
    };
    
    mousePosRef.current = newPos;

    // Add to trail
    const now = Date.now();
    trailRef.current = [{ ...newPos, timestamp: now }];
  }, []);

  // Handle touch move
  const handleTouchMove = useCallback((e: TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || e.touches.length === 0) return;
    
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const dpr = window.devicePixelRatio || 1;
    
    // Calculate position relative to canvas in device pixels
    // canvas.width/height are in device pixels, rect.width/height are in CSS pixels
    const newPos = {
      x: (touch.clientX - rect.left) * dpr,
      y: (touch.clientY - rect.top) * dpr,
    };
    
    mousePosRef.current = newPos;

    // Add to trail with higher frequency for smoother animation
    const now = Date.now();
    const trail = trailRef.current;
    if (trail.length === 0 || now - trail[trail.length - 1].timestamp > 10) {
      trailRef.current = [...trail.slice(-TRAIL_MAX_POINTS + 1), { ...newPos, timestamp: now }];
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    mousePosRef.current = null;
    trailRef.current = [];
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
      // Small delay to ensure DOM is ready, especially on mobile
      setTimeout(() => {
        initDots();
      }, 50);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    // Also listen for orientation changes on mobile
    window.addEventListener('orientationchange', () => {
      setTimeout(resizeCanvas, 100);
    });

    // Start animation loop
    lastTimeRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(render);

    // Add event listeners
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    // Touch support
    canvas.addEventListener('touchstart', handleTouchStart, { passive: true });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: true });
    canvas.addEventListener('touchend', handleTouchEnd);
    canvas.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('orientationchange', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      // Touch cleanup
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      canvas.removeEventListener('touchcancel', handleTouchEnd);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [initDots, render, handleMouseMove, handleMouseLeave, handleTouchStart, handleTouchMove, handleTouchEnd]);

  return (
    <canvas
      ref={canvasRef}
      className="dot-background"
    />
  );
}
