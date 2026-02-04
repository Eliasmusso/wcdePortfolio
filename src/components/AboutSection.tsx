import { useRef, useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import Spline from "@splinetool/react-spline";
import { Download } from "lucide-react";
import { ErrorBoundary } from "./ErrorBoundary";
import logoWhite from "../assets/assets/WCD(E)_LogoWeiß.svg";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealTextProps {
  text: string;
  containerRef: React.RefObject<HTMLDivElement>;
}

const DELAY_FACTOR = 0.3;
const LETTER_OPACITY_START = 0.2;
const LETTER_OPACITY_END = 1;

function ScrollRevealText({ text, containerRef }: ScrollRevealTextProps) {
  const textRef = useRef<HTMLSpanElement>(null);
  const words = text.split(" ");
  
  useEffect(() => {
    // Use useEffect instead of useLayoutEffect for production compatibility
    if (!textRef.current || !containerRef.current) return;
  
    // Small delay to ensure DOM is fully rendered in production builds
    const initAnimation = () => {
      const letters = textRef.current?.querySelectorAll('.scroll-reveal-letter');
      if (!letters || letters.length === 0) {
        // Retry if elements not ready yet
        requestAnimationFrame(initAnimation);
        return;
      }
      
      const totalLetters = letters.length;
      
      // Set initial opacity
      gsap.set(letters, { opacity: LETTER_OPACITY_START });
      
      // Create a single timeline with ScrollTrigger for sequential letter reveal
      const ctx = gsap.context(() => {
        // Create a timeline for the entire text reveal
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",      // Start when container enters viewport
            end: "center top",        // End when center of container reaches top
            scrub: 0.5,               // Smooth scrubbing
            invalidateOnRefresh: true, // Recalculate on refresh
            refreshPriority: -1,      // Ensure proper refresh order
          }
        });
        
        // Add delay at the beginning (30% of scroll before text starts revealing)
        tl.to({}, { duration: DELAY_FACTOR });
        
        // Animate each letter sequentially
        letters.forEach((letter, index) => {
          // Each letter takes a small fraction of the remaining timeline
          const letterDuration = (1 - DELAY_FACTOR) / totalLetters;
          
          tl.to(letter, {
            opacity: LETTER_OPACITY_END,
            duration: letterDuration * 1.5, // Slightly overlap for smoother effect
            ease: "none",
          }, DELAY_FACTOR + (index * letterDuration)); // Stagger start times
        });
        
        // Force ScrollTrigger refresh after setup (critical for production)
        requestAnimationFrame(() => {
          ScrollTrigger.refresh();
        });
      }, textRef);
      
      // Store context for cleanup
      (textRef.current as any).__gsapContext = ctx;
    };
    
    // Start initialization
    requestAnimationFrame(initAnimation);
    
    return () => {
      // Cleanup
      const ctx = (textRef.current as any)?.__gsapContext;
      if (ctx) {
        ctx.revert();
      }
      
      // Kill all ScrollTriggers associated with this container
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === containerRef.current || 
            (st.vars && st.vars.trigger === containerRef.current)) {
          st.kill();
        }
      });
    };
  }, [containerRef, text]);
  
  // Count total characters for proper indexing
  let charIndex = 0;
  
  return (
    <span className="scroll-reveal-text" ref={textRef}>
      {words.map((word, wordIndex) => {
        if (word === "WCD(E)") {
          const logoElement = (
            <span 
              key={`word-${wordIndex}`} 
              className="scroll-reveal-word"
              style={{ whiteSpace: 'nowrap', display: 'inline-block' }}
            >
              <span className="scroll-reveal-letter logo-container">
                <img src={logoWhite} alt="WCD(E)" className="inline-logo" />
              </span>
            </span>
          );
          charIndex += 5; // WCD(E) counts as 5 characters
          
          // Add space after word (except last word)
          if (wordIndex < words.length - 1) {
            charIndex += 1;
            return (
              <span key={`word-wrapper-${wordIndex}`}>
                {logoElement}
                <span className="scroll-reveal-letter scroll-reveal-space">{"\u00A0"}</span>
              </span>
            );
          }
          return logoElement;
        } else {
          const letters = word.split("");
          const wordElement = (
            <span 
              key={`word-${wordIndex}`} 
              className="scroll-reveal-word"
              style={{ whiteSpace: 'nowrap', display: 'inline-block' }}
            >
              {letters.map((letter, letterIdx) => {
                charIndex++;
            return (
                  <span
                key={`${wordIndex}-${letterIdx}`}
                className="scroll-reveal-letter"
              >
                {letter}
                  </span>
                );
              })}
            </span>
            );
          
          // Add space after word (except last word)
          if (wordIndex < words.length - 1) {
            charIndex += 1;
            return (
              <span key={`word-wrapper-${wordIndex}`}>
                {wordElement}
                <span className="scroll-reveal-letter scroll-reveal-space">{"\u00A0"}</span>
              </span>
            );
          }
          return wordElement;
        }
      })}
    </span>
  );
}

const SPLINE_FALLBACK_STYLE: React.CSSProperties = {
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg, rgba(30,30,30,0.9), rgba(50,50,50,0.9))",
  color: "rgba(255,255,255,0.7)",
  fontSize: "0.9rem",
  textAlign: "center",
  padding: "1rem",
};

function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const [currentPerson, setCurrentPerson] = useState<"elias" | "justin">("elias");
  const [splineOk, setSplineOk] = useState<Record<"elias" | "justin", boolean | null>>({
    elias: null,
    justin: null,
  });

  const togglePerson = () => {
    setCurrentPerson((prev) => (prev === "elias" ? "justin" : "elias"));
  };

  const personData = {
    elias: {
      name: "Elias Musso",
      role: "Graphic Designer",
      services: ["Brand Design", "Typography", "Visual Identity", "Print Design", "Logo Design"],
      splineScene: "https://prod.spline.design/wStu4tKS9sirJXUd/scene.splinecode",
    },
    justin: {
      name: "Justin Jambrec",
      role: "Software Engineer",
      services: ["Web Development", "Frontend", "Backend", "UI/UX", "Database Design"],
      splineScene: "https://prod.spline.design/2b6kFeKMmzE0I-K1/scene.splinecode",
    },
  };

  useEffect(() => {
    const url = personData[currentPerson].splineScene;
    if (splineOk[currentPerson] !== null) return;
    let cancelled = false;
    fetch(url, { method: "HEAD", mode: "cors" })
      .then((res) => {
        if (!cancelled) setSplineOk((prev) => ({ ...prev, [currentPerson]: res.ok }));
      })
      .catch(() => {
        if (!cancelled) setSplineOk((prev) => ({ ...prev, [currentPerson]: false }));
      });
    return () => {
      cancelled = true;
    };
  }, [currentPerson]);

  return (
    <section id="about" className="section section-about" ref={sectionRef}>
      {/* Scroll-gesteuerter Text-Reveal */}
      <div className="scroll-text-container" ref={textContainerRef}>
        <div className="scroll-text-content">
          <ScrollRevealText 
            text="WCD(E) is a creative-tech duo of digital innovators. We are merging high-end Graphic Design with Informatics and deliver everything from trend-setting branding to AI Automations. We believe in a future where aesthetics and technology work in perfect harmony. If you're looking for a fresh, innovative partner to scale your vision, you've found us."
            containerRef={textContainerRef}
          />
        </div>
      </div>

      <div className="container">
        <header className="about-header" style={{ textAlign: "left", paddingLeft: "2rem", maxWidth: "none", width: "100%" }}>
              <h2 className="hero-heading" style={{ fontSize: "clamp(3.1rem, 5.6vw, 4.4rem)" }}>
                ABOUT US
              </h2>
        </header>

        {/* Person Toggle Section */}
        <div className="person-section">
          <motion.div 
            className="person-display"
            key={currentPerson}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="person-image-container">
              <div className="person-photo-placeholder justin-spline-container">
                {splineOk[currentPerson] === true ? (
                  <ErrorBoundary
                    fallback={
                      <div className="spline-fallback" style={SPLINE_FALLBACK_STYLE}>
                        <span>{personData[currentPerson].name}</span>
                      </div>
                    }
                  >
                    <Suspense
                      fallback={
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "rgba(255,255,255,0.6)",
                          }}
                        >
                          Loading...
                        </div>
                      }
                    >
                      <Spline
                        scene={personData[currentPerson].splineScene}
                        {...({ width: 1080, height: 1920 } as any)}
                        onError={(err) => console.error("Spline scene error:", err)}
                      />
                    </Suspense>
                  </ErrorBoundary>
                ) : splineOk[currentPerson] === false ? (
                  <div className="spline-fallback" style={SPLINE_FALLBACK_STYLE}>
                    <span>{personData[currentPerson].name}</span>
                  </div>
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "rgba(255,255,255,0.6)",
                    }}
                  >
                    Loading...
                  </div>
                )}
              </div>
              <div className="person-toggle-container">
                <div className="person-toggle-switch">
                  <button 
                    className={`person-toggle-option ${currentPerson === 'elias' ? 'active' : ''}`}
                    onClick={() => setCurrentPerson('elias')}
                  >
                    Elias
                  </button>
                  <button 
                    className={`person-toggle-option ${currentPerson === 'justin' ? 'active' : ''}`}
                    onClick={() => setCurrentPerson('justin')}
                  >
                    Justin
                  </button>
                </div>
              </div>
            </div>
            <div className="person-info">
              <h3 className="person-name">{personData[currentPerson].name}</h3>
              <p className="person-role">{personData[currentPerson].role}</p>
              <div className="service-tags">
                {personData[currentPerson].services.map((service, index) => (
                  <span key={index} className="service-tag">
                    {service}
                  </span>
                ))}
              </div>
                <a 
                href={currentPerson === 'elias' ? "/assets/CV_Elias_Musso.pdf" : "/assets/CV_Justin_Jambrec.pdf"} 
                download={currentPerson === 'elias' ? "CV_Elias_Musso.pdf" : "CV_Justin_Jambrec.pdf"}
                  className="cv-download-btn"
                >
                  <Download className="cv-download-icon" />
                  DOWNLOAD CV
                </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;



