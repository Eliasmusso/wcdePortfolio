import { useState, useRef, useEffect } from "react";

const categories = ["Design", "Development", "KI Automation"];

const SCROLL_THRESHOLDS = {
  DESIGN: 0.45,
  DEVELOPMENT: 0.6,
  AUTOMATION: 0.8,
} as const;

// Tags, die bei bestimmten Kategorien hervorgehoben werden sollen
const highlightedTagsByCategory: Record<number, string[]> = {
  0: [ // Design
    "Website", // webdesign
    "3D Design",
    "Textile Design",
    "Digital Ad Campaigns",
    "Corporate Design",
    "Logo",
    "Branding", // logo branding
    "Print Design",
  ],
  1: [ // Development
    "Website",
    "Website Development",
    "Webshop",
    "SEO",
    "User Interface Design",
    "User Experience Optimization",
    "Web Apps",
  ],
  2: [ // KI Automation
    "Invoice Automation",
    "Email Automation",
  ],
};

// Tags gruppiert in „Reihen", um die organische Anordnung wie in der Vorlage nachzubilden
const serviceTagRows = [
  [
    { label: "Website" },
    { label: "3D Design" },
    { label: "Textile Design" },
  ],
  [
    { label: "Digital Ad Campaigns" },
    { label: "Website Development" },
  ],
  [
    { label: "Invoice Automation" },
    { label: "Print Design" },
    { label: "Email Automation" },
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

// Mobile: Tags gruppiert nach Kategorie
const tagsByCategory: Record<number, string[]> = {
  0: [ // Design
    "Website",
    "3D Design",
    "Textile Design",
    "Digital Ad Campaigns",
    "Print Design",
    "Logo",
    "Corporate Design",
    "Branding",
  ],
  1: [ // Development
    "Website",
    "Website Development",
    "Webshop",
    "SEO",
    "User Interface Design",
    "User Experience Optimization",
    "Web Apps",
  ],
  2: [ // KI Automation
    "Invoice Automation",
    "Email Automation",
  ],
};

function ServicesSection() {
  const [activeCategory, setActiveCategory] = useState(0);
  const sectionRef = useRef<HTMLElement | null>(null);
  const activeCategoryRef = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const homeSection = document.querySelector("#home");
          if (!homeSection) {
            setActiveCategory(0);
            ticking = false;
            return;
          }

          const homeRect = homeSection.getBoundingClientRect();
          const homeReachedTop = homeRect.top <= 0;

          if (!homeReachedTop) {
            setActiveCategory(0);
            ticking = false;
            return;
          }
          
          const wrapper = section.parentElement;
          if (!wrapper) {
            ticking = false;
            return;
          }
          
          const wrapperRect = wrapper.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          const wrapperTop = wrapperRect.top;
          const wrapperHeight = wrapperRect.height;
          
          const scrollStart = windowHeight;
          const scrollEnd = -wrapperHeight;
          const scrollRange = scrollStart - scrollEnd;
          const currentScroll = scrollStart - wrapperTop;
          
          const scrollProgress = Math.min(1, Math.max(0, currentScroll / scrollRange));

          let newCategory = 0;
          if (scrollProgress < SCROLL_THRESHOLDS.DESIGN) {
            newCategory = 0;
          } else if (scrollProgress < SCROLL_THRESHOLDS.DEVELOPMENT) {
            newCategory = 1;
          } else if (scrollProgress < SCROLL_THRESHOLDS.AUTOMATION) {
            newCategory = 2;
          } else {
            newCategory = 2;
          }
          
          if (newCategory !== activeCategoryRef.current) {
            activeCategoryRef.current = newCategory;
            setActiveCategory(newCategory);
          } else if (activeCategory !== newCategory) {
            setActiveCategory(newCategory);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeCategory]);

  return (
    <div className="services-wrapper">
      <section
        id="services"
        ref={sectionRef}
        className="section section-services"
      >
        <div className="container">
          <div className="services-layout services-layout-desktop">
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

          <div className="services-layout services-layout-mobile">
            <header className="services-header">
              <h2 className="portfolio-heading">SERVICES</h2>
            </header>
            
            {categories.map((cat, catIndex) => {
              const isActiveGroup = activeCategory === catIndex;
              return (
                <div 
                  key={cat} 
                  className={`services-mobile-group ${isActiveGroup ? "services-mobile-group-active" : ""}`}
                >
                  <div 
                    className={`services-category accent-heading services-category-mobile ${
                      isActiveGroup ? "services-category-active" : ""
                    }`}
                  >
                    {cat}
                  </div>
                  <div className="services-tags-mobile">
                    {tagsByCategory[catIndex]?.map((tagLabel) => (
                      <button
                        key={tagLabel}
                        type="button"
                        className={isActiveGroup ? "service-tag service-tag-hot" : "service-tag"}
                      >
                        {tagLabel}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

export default ServicesSection;
