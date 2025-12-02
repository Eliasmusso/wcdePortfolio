import { useState } from "react";
import Header from "./components/Header";
import ServicesSection from "./components/ServicesSection";
import PortfolioSection from "./components/PortfolioSection";
import AboutSection from "./components/AboutSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import { TextRevealByWord } from "./components/TextRevealByWord";
import { DotBackground } from "./components/DotBackground";
import { LoadingScreen } from "./components/LoadingScreen";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
      <Header />
      <main>
        <section id="home" className="section section-home">
          {/* Dot-Hintergrund AUSSERHALB des Containers */}
          <DotBackground
            dotColor="#555555"
            hoverColor="#e0001a"
            dotSize={2}
            spacing={20}
          />
          
          <div className="container home-content">
            {/* Vordergrund-Content */}
            <div className="home-hero">
              <p className="eyebrow">CREATIVE AGENCY · WCD(E)</p>
              <h1 className="hero-heading">
                <div className="hero-line">
                  <TextRevealByWord text="WE HELP YOU" className="accent-heading" />
                </div>
                <div className="hero-line">
                  <TextRevealByWord
                    text="STAND OUT IN"
                    highlightWords={["STAND", "OUT"]}
                  />
                </div>
                <div className="hero-line">
                  <TextRevealByWord text="THE DIGITAL AGE." />
                </div>
              </h1>
              <div className="home-ctas">
                <a href="#portfolio" className="btn-cta hero-cta-primary">
                  PROJEKTE ANSEHEN
                </a>
                <a href="#contact" className="btn-secondary hero-cta-secondary">
                  ANFRAGE SENDEN
                </a>
              </div>
            </div>
          </div>
        </section>

        <ServicesSection />
        <PortfolioSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}

export default App;

