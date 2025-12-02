import React from "react";

const categories = ["Design", "Development", "KI Optimization"];

// Tags, die bei bestimmten Kategorien hervorgehoben werden sollen
const highlightedTagsByCategory: Record<number, string[]> = {
  0: [ // Design
    "Website", // webdesign
    "Website Development", // webdesign (alternative)
    "3D Visualisation",
    "Textile Design",
    "Digital Ad Campaigns",
    "Corporate Design",
    "Logo",
    "Branding", // logo branding
  ],
  1: [ // Development
    "Website",
    "Webshop",
    "SEO",
    "User Interface Design",
    "User Experience Optimization",
    "Web Apps",
  ],
  2: [ // KI Optimization
    "Chatbot",
    "3D Visualisation",
    "Email Automatisation",
  ],
};

// Tags gruppiert in „Reihen", um die organische Anordnung wie in der Vorlage nachzubilden
const serviceTagRows = [
  [
    { label: "Website" },
    { label: "3D Visualisation" },
    { label: "Textile Design" },
  ],
  [
    { label: "Digital Ad Campaigns" },
    { label: "Website Development" },
  ],
  [
    { label: "Chatbot" },
    { label: "Printdesign" },
    { label: "Email Automatisation" },
  ],
  [
    { label: "Web Apps" },
    { label: "Logo" },
    { label: "Corporate Design" },
  ],
  [
    { label: "User Experience Optimization" },
    { label: "Webshop" },
  ],
  [
    { label: "User Interface Design" },
    { label: "Branding" },
    { label: "SEO" },
  ],
];

function ServicesSection() {
  const [activeCategory, setActiveCategory] = React.useState(0); // Startet mit Design (0)
  const sectionRef = React.useRef<HTMLElement | null>(null);
  const activeCategoryRef = React.useRef(0);

  React.useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleScroll = () => {
      // Prüfe ob Home-Section (id="home") den oberen Rand erreicht hat
      const homeSection = document.querySelector("#home");
      if (!homeSection) {
        // Fallback: Starte sofort wenn Home-Section nicht gefunden wird
        setActiveCategory(0);
        return;
      }

      const homeRect = homeSection.getBoundingClientRect();
      const homeReachedTop = homeRect.top <= 0;

      // Wenn Home-Section noch nicht oben ist, setze erste Kategorie und beende
      if (!homeReachedTop) {
        setActiveCategory(0); // Design als Standard
        return;
      }

      // Ab hier: Home-Section ist oben, Animation kann starten
      // Berechne Scroll-Progress basierend auf dem Scrollen durch den Services-Wrapper
      
      const wrapper = section.parentElement;
      if (!wrapper) return;
      
      const wrapperRect = wrapper.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Berechne Scroll-Progress basierend auf der Position des Wrappers
      // Progress = 0: Wrapper erscheint gerade im Viewport (wrapperTop = windowHeight)
      // Progress = 1: Wrapper ist komplett durchgescrollt (wrapperTop = -wrapperHeight)
      let scrollProgress = 0;
      
      const wrapperTop = wrapperRect.top;
      const wrapperHeight = wrapperRect.height;
      
      // Berechne Progress basierend auf dem Scrollen durch den Wrapper
      const scrollStart = windowHeight; // Punkt, wo Wrapper erscheint
      const scrollEnd = -wrapperHeight; // Punkt, wo Wrapper komplett durchgescrollt ist
      const scrollRange = scrollStart - scrollEnd; // Gesamter Scroll-Bereich
      const currentScroll = scrollStart - wrapperTop; // Aktuelle Scroll-Position
      
      scrollProgress = Math.min(1, Math.max(0, currentScroll / scrollRange));

      // Teile die Section in 3 Bereiche
      // Design: 0-45%, Development: 45-60%, KI Optimization: 60-80%
      let newCategory = 0;
      if (scrollProgress < 0.45) {
        newCategory = 0; // Design
      } else if (scrollProgress < 0.6) {
        newCategory = 1; // Development
      } else if (scrollProgress < 0.8) {
        newCategory = 2; // KI Optimization
      } else {
        newCategory = 2; // KI Optimization bleibt aktiv
      }
      
      // Aktualisiere immer, auch wenn sich der Wert nicht geändert hat (für initiales Rendering)
      if (newCategory !== activeCategoryRef.current) {
        activeCategoryRef.current = newCategory;
        setActiveCategory(newCategory);
      } else if (activeCategory !== newCategory) {
        // Fallback: Wenn State nicht mit Ref übereinstimmt, synchronisiere
        setActiveCategory(newCategory);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="services-wrapper">
      <section
        id="services"
        ref={sectionRef}
        className="section section-services"
      >
        <div className="container">
          <div className="services-layout">
            <header className="services-header">
              <h2 className="portfolio-heading">SERVICES</h2>
            </header>
            <div className="services-left">
              {categories.map((cat, index) => (
                <div
                  key={cat}
                  className={`services-category accent-heading ${
                    activeCategory === index ? "services-category-active" : ""
                  }`}
                >
                  {cat}
                </div>
              ))}
            </div>

            <div className="services-right">
              <div className="services-tags">
                {serviceTagRows.map((row, idx) => (
                  <div key={idx} className="services-tag-row">
                    {row.map((tag) => {
                      const highlightedTags = highlightedTagsByCategory[activeCategory] || [];
                      const isHighlighted = highlightedTags.includes(tag.label);
                      return (
                        <button
                          key={tag.label}
                          type="button"
                          className={
                            isHighlighted ? "service-tag service-tag-hot" : "service-tag"
                          }
                        >
                          {tag.label}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ServicesSection;


