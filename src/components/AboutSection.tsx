import { useRef, useState, Suspense } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import logoWhite from "../assets/assets/WCD(E)_LogoWeiß.svg";
import Spline from '@splinetool/react-spline';


// Scroll-basierte Buchstaben-Reveal Komponente mit Logo
function ScrollRevealText({ text, scrollProgress, startProgress = 0, endProgress = 1 }: {
  text: string;
  scrollProgress: any;
  startProgress?: number;
  endProgress?: number;
}) {
  // Text in Wörter aufteilen und WCD(E) durch Logo ersetzen
  const words = text.split(" ");
  let letterIndex = 0;
  
  // Der Effekt betrifft den gesamten Text, startet aber später im Scroll-Verlauf
  // Verschiebe den Start des Reveal-Effekts zeitlich nach hinten (z.B. bei 30% des Scroll-Progress)
  const delayedStartProgress = startProgress + 0.3 * (endProgress - startProgress);
  
  return (
    <span className="scroll-reveal-text">
      {words.map((word, wordIndex) => {
        if (word === "WCD(E)") {
          // Logo anstelle von WCD(E) Text
          // Der Effekt betrifft den gesamten Text, startet aber später
          const logoStart = delayedStartProgress + (letterIndex / text.length) * (endProgress - delayedStartProgress);
          const logoEnd = logoStart + (5 / text.length) * (endProgress - delayedStartProgress);
          
          const logoOpacity = useTransform(
            scrollProgress,
            [logoStart, logoEnd],
            [0.2, 1]
          );
          letterIndex += 5; // WCD(E) hat 5 Zeichen
          
            return (
              <motion.span
                key={`logo-${wordIndex}`}
                style={{ opacity: logoOpacity }}
                className="scroll-reveal-letter logo-container"
              >
                <img src={logoWhite} alt="WCD(E)" className="inline-logo" />
              </motion.span>
            );
        } else {
          // Normale Buchstaben
          const letters = word.split("");
          const wordElements = letters.map((letter, letterIdx) => {
            // Der Effekt betrifft den gesamten Text, startet aber später
            const letterStart = delayedStartProgress + (letterIndex / text.length) * (endProgress - delayedStartProgress);
            const letterEnd = letterStart + (0.8 / text.length) * (endProgress - delayedStartProgress);
            
            const letterOpacity = useTransform(
              scrollProgress,
              [letterStart, letterEnd],
              [0.2, 1]
            );
            
            letterIndex++;
            
            return (
              <motion.span
                key={`${wordIndex}-${letterIdx}`}
                style={{ opacity: letterOpacity }}
                className="scroll-reveal-letter"
              >
                {letter}
              </motion.span>
            );
          });
          
          // Leerzeichen nach dem Wort hinzufügen (außer beim letzten Wort)
          if (wordIndex < words.length - 1) {
            // Der Effekt betrifft den gesamten Text, startet aber später
            const spaceStart = delayedStartProgress + (letterIndex / text.length) * (endProgress - delayedStartProgress);
            const spaceEnd = spaceStart + (1 / text.length) * (endProgress - delayedStartProgress);
            
            const spaceOpacity = useTransform(
              scrollProgress,
              [spaceStart, spaceEnd],
              [0.2, 1]
            );
            letterIndex++;
            
            wordElements.push(
              <motion.span
                key={`space-${wordIndex}`}
                style={{ opacity: spaceOpacity }}
                className="scroll-reveal-letter"
              >
                {"\u00A0"}
              </motion.span>
            );
          }
          
          return wordElements;
        }
      })}
    </span>
  );
}

function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const [currentPerson, setCurrentPerson] = useState<'elias' | 'justin'>('elias');
  
  // Scroll-Progress spezifisch für den Text-Container
  const { scrollYProgress } = useScroll({
    target: textContainerRef,
    offset: ["start end", "start start"] // Von "Container startet unten im Viewport" bis "Container erreicht oben im Viewport"
  });
  
  // Logo erscheint früh und schnell
  const logoOpacity = useTransform(scrollYProgress, [0, 0.2], [0.2, 1]);


  const togglePerson = () => {
    setCurrentPerson(prev => prev === 'elias' ? 'justin' : 'elias');
  };

  const personData = {
    elias: {
      name: "Elias Musso",
      role: "Graphic Designer",
      services: ["Brand Design", "Typography", "Visual Identity", "Print Design", "Logo Design"],
      splineScene: "https://prod.spline.design/wStu4tKS9sirJXUd/scene.splinecode"
    },
    justin: {
      name: "Justin Jambrec", 
      role: "Software Engineer",
      services: ["Web Development", "Frontend", "Backend", "UI/UX", "Database Design"],
      splineScene: "https://prod.spline.design/2b6kFeKMmzE0I-K1/scene.splinecode"
    }
  };

  return (
    <section id="about" className="section section-about" ref={sectionRef}>
      {/* Scroll-gesteuerter Text-Reveal */}
      <div className="scroll-text-container" ref={textContainerRef}>
        <div className="scroll-text-content">
          <ScrollRevealText 
            text="WCD(E) is a collective of passionate digital innovators and multidisciplinary designers dedicated to building bold brands and distinct online identities. We craft meaningful digital experiences that merge creativity with strategy, helping forward-thinking companies connect deeply with their audiences."
            scrollProgress={scrollYProgress}
            startProgress={0}
            endProgress={1}
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
              <div className={`person-photo-placeholder ${currentPerson === 'justin' ? 'justin-spline-container' : ''}`}>
                <Suspense fallback={<div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>Loading 3D scene...</div>}>
                  {currentPerson === 'justin' ? (
                    <Spline
                      scene={personData[currentPerson].splineScene}
                      {...({ width: 1080, height: 1920 } as any)}
                      onError={(error) => {
                        console.error('Spline scene error:', error);
                      }}
                    />
                  ) : (
                    <Spline
                      scene={personData[currentPerson].splineScene}
                      onError={(error) => {
                        console.error('Spline scene error:', error);
                      }}
                    />
                  )}
                </Suspense>
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
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;



