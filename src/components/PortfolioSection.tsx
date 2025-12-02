import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import ProjectDetailModal from "./ProjectDetailModal";

// Platzhalter-Bilder für Modal-Test
const placeholderImage1 = "https://via.placeholder.com/800x600/1a1a1a/FFFFFF?text=Project+Image+1";
const placeholderImage2 = "https://via.placeholder.com/800x600/2a2a2a/FFFFFF?text=Project+Image+2";
const placeholderImage3 = "https://via.placeholder.com/800x600/3a3a3a/FFFFFF?text=Project+Image+3";

// Helfair images - from public directory
const helfairMainImg = "/assets/Helfair_Wort_Bild_Über_HG.JPG";
const helfairGutscheinImg = "/assets/Mein_Helfair_Gutschein_Präsentation_Juni_2024-bilder-0 2.jpg";
const helfairMacbookImg = "/assets/IMG_4445.jpeg";
const helfairBannerImg = "/assets/IMG_4454.jpeg"; // Banner im Büro

// Sportschule Bodensee images - from public directory
const sportschuleMainImg = "/assets/sportschule_logo_website.JPG";
const sportschuleInstagramImg = "/assets/SportschuleBodenseeInstagram3_resized.JPG";
const sportschuleFlyerImg = "/assets/Roll_Fold_DL_Flyer_Mockup_6.jpg";
const sportschuleGrapplingImg = "/assets/1-2.jpg";

// Verwende Platzhalter-Bilder für jetzt - können später durch echte Bilder ersetzt werden
const sportschuleImg: string = sportschuleMainImg;
const sportschuleImg2: string = sportschuleInstagramImg;
const sportschuleImg3: string = sportschuleFlyerImg;
const sportschuleImg4: string = sportschuleGrapplingImg;
// Trias YouTube video thumbnail
const triasVideoId = "a4P-3FovI9c";
const triasImg: string = `https://img.youtube.com/vi/${triasVideoId}/maxresdefault.jpg`;
// KreativRaum:Fliese images - from public directory
const kreativraumBusinessCardImg = "/assets/Free_Square_Business_Card_Mockup_1.png";
const kreativraumMacbookImg = "/assets/MacBook_Mockup_1.jpg";
const kreativraumImg: string = kreativraumBusinessCardImg; // Business Card als Vorschaubild
const kreativraumImg2: string = kreativraumMacbookImg;
const helfairImg: string = helfairMainImg;
const helfairImg2: string = helfairGutscheinImg;
const helfairImg3: string = helfairMacbookImg; // MacBook mit Flyern
const helfairImg4: string = helfairBannerImg; // Banner im Büro
const keimbaImg1: string = "/assets/KeimbaTemplate2.png";
const keimbaImg2: string = "/assets/KeimbaTemplate3.png";

interface Project {
  id: string;
  title: string;
  tags: string[];
  image: string;
  images?: string[]; // For modal gallery
  videoUrl?: string; // YouTube video URL
  description?: string; // Project description text for modal
  hasModal?: boolean; // Whether this project should open a modal
}

const projects: Project[] = [
  {
    id: "sportschule",
    title: "Sportschule Bodensee",
    tags: ["Branding", "Web Design", "Social Media"],
    image: sportschuleImg, // sportschule_logo_website.JPG als Vorschaubild im Carousel
    images: [
      sportschuleImg, // sportschule_logo_website.JPG
      sportschuleImg2, // SportschuleBodenseeInstagram3_resized.JPG
      sportschuleImg3, // Roll_Fold_DL_Flyer_Mockup_6.jpg
      sportschuleImg4, // 1-2.jpg (Grappling Poster)
    ],
    description: "Building a strong online presence is essential in today's digital world.\n\nFor Sportschule Bodensee, we created a dynamic corporate design which represent the clubs energy. We also designed a website and take care of their social media that highlights their values — discipline, respect, fairness, and courage.\n\nDo you need help to elevate your brand online? Contact us!",
    hasModal: true,
  },
  {
    id: "trias",
    title: "Trias",
    tags: ["Branding", "Print Design"],
    image: triasImg,
    videoUrl: "https://www.youtube.com/watch?v=a4P-3FovI9c",
    description: "For TRIAS, we produced a high-end 3D animation showcasing their innovative terrace substructure system.\n\nWe handled the full production process:\n\n - Photorealistic rendering\n\n - Functional and installation animation\n\n -Storyboarding and visual concept\n\n -Video editing and music selection\n\nThe result: A brand-aligned video that clearly communicates the system's structure to the client.\n\nWant to showcase your product with 3d visuals?\n\nLet's bring your vision to life — from idea to final cut.",
    hasModal: true,
  },
  {
    id: "kreativraum",
    title: "KreativRaum:Fliese",
    tags: ["Branding", "Web Design"],
    image: kreativraumImg, // Free_Square_Business_Card_Mockup_1.png als Vorschaubild im Carousel
    images: [
      kreativraumImg, // Free_Square_Business_Card_Mockup_1.png
      kreativraumImg2, // MacBook_Mockup_1.jpg
    ],
    description: "We had the opportunity to rethink the brand presence of Kreativraum:Fliese, a showroom dedicated to high-quality tile collections.\n\nFrom logo redesign to website, the new identity reflects a clear, architectural aesthetic tailored to resonate with architects and interior designers. A minimal, structured look that lets materials and spaces speak for themselves.\n\nNeed a new design or website for your brand? Let's talk.\n\nDiscover the new identity https://mdorrer.com/",
    hasModal: true,
  },
  {
    id: "helfair",
    title: "Helfair",
    tags: ["Branding", "Web Design", "Print"],
    image: helfairImg, // Helfair_Wort_Bild_Über_HG.JPG als Hauptbild im Carousel
    images: [
      helfairImg3, // MacBook mit Flyern (nebeneinander)
      helfairImg4, // Banner im Büro (nebeneinander)
      helfairImg, // Helfair_Wort_Bild_Über_HG.JPG (untereinander)
      helfairImg2, // Gutschein (untereinander)
    ],
    description: "We are excited to present you our first graphic design work for Mein Helfair\n\nMein Helfair is a start-up that offers supporting services for seniors, including IT support and gardening, and continuously recruits part-time workers for attractive side jobs.\n\nFor Mein Helfair, we developed an appealing corporate design that reflects the company's values and mission. We designed flyers, trade show banners, vouchers and social media posts that visually represent the company and support its marketing goals.\n\nIt was a great experience working with Mein Helfair and translating their vision into effective visual communication.\n\nContact us for your visual experience.",
    hasModal: true,
  },
  {
    id: "keimba",
    title: "Keimba",
    tags: ["Branding", "Web Design"],
    image: keimbaImg1, // KeimbaTemplate2.png als Vorschaubild im Carousel
    images: [
      keimbaImg1, // KeimbaTemplate2.png
      keimbaImg2, // KeimbaTemplate3.png
    ],
    description: "We had the pleasure of supporting keimba in bringing their vision of healthy, sprouted products online. The new shop was developed with a focus on performance, usability, and a clean design aligned with the existing brand guidelines.\n\nDo you need a website or online store? We're here to bring your vision to life.\n\nFor the full experience visit www.keimba.at",
    hasModal: true,
  },
];

function PortfolioSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const [totalCarouselWidth, setTotalCarouselWidth] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [aboutSectionVisible, setAboutSectionVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Viewport width
  useEffect(() => {
    const updateViewport = () => {
      const vw = window.innerWidth;
      setViewportWidth(vw);
      // Card width: 50% of viewport (hanging out 50% on each side)
      setCardWidth(vw * 0.5);
    };
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  // Calculate total carousel width
  useEffect(() => {
    if (cardWidth > 0 && projects.length > 0) {
      // Each card takes cardWidth + gap (2rem = 32px)
      const gap = 32;
      const total = projects.length * cardWidth + (projects.length - 1) * gap;
      setTotalCarouselWidth(total);
    }
  }, [cardWidth]);

  const carouselX = useMotionValue(viewportWidth);
  const carouselOpacity = useMotionValue(0);

  // Check if About section is visible
  useEffect(() => {
    const checkAboutSection = () => {
      const aboutSection = document.getElementById("about");
      if (!aboutSection) {
        setAboutSectionVisible(false);
        return;
      }

      const rect = aboutSection.getBoundingClientRect();
      // About section is visible if it's in the viewport
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      setAboutSectionVisible(isVisible);
    };

    checkAboutSection();
    window.addEventListener("scroll", checkAboutSection, { passive: true });
    window.addEventListener("resize", checkAboutSection);
    return () => {
      window.removeEventListener("scroll", checkAboutSection);
      window.removeEventListener("resize", checkAboutSection);
    };
  }, []);

  // Scroll-based animation
  useEffect(() => {
    const updateCarouselPosition = () => {
      if (!sectionRef.current || totalCarouselWidth === 0 || viewportWidth === 0) {
        carouselX.set(viewportWidth);
        carouselOpacity.set(0);
        return;
      }

      // If About section is visible, hide carousel but keep final position
      if (aboutSectionVisible) {
        carouselOpacity.set(0);
        setIsVisible(false);
        // Keep final position instead of moving off-screen to prevent jump
        const targetX = -(totalCarouselWidth - viewportWidth + 20);
        carouselX.set(targetX);
        return;
      }

      const rect = sectionRef.current.getBoundingClientRect();
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      const sectionBottom = rect.bottom;
      const viewportHeight = window.innerHeight;
      const vw = window.innerWidth;

      // Hide carousel if section is completely scrolled past (below viewport)
      // But keep final position instead of moving off-screen
      if (sectionBottom < 0) {
        carouselOpacity.set(0);
        setIsVisible(false);
        // Keep final position instead of moving off-screen to prevent jump
        const targetX = -(totalCarouselWidth - viewportWidth + 20);
        carouselX.set(targetX);
        return;
      }

      // Check if section is fully in viewport (top <= 0 and height >= 100vh)
      const sectionFullyVisible = sectionTop <= 0 && sectionHeight >= viewportHeight;

      if (!sectionFullyVisible) {
        // Section not fully visible yet - carousel off-screen to the right and invisible
        carouselX.set(vw * 2); // Move completely off-screen
        carouselOpacity.set(0);
        setIsVisible(false);
        return;
      }

      // Animation has started - make carousel visible
      setIsVisible(true);
      carouselOpacity.set(1);

      // Calculate scroll progress within the section
      // Start: section top at viewport top (sectionTop = 0)
      // End: when last card is 20px from right edge
      const scrollDistance = -sectionTop; // Distance scrolled past section start
      const maxScrollDistance = sectionHeight - viewportHeight; // Total scrollable distance

      if (maxScrollDistance <= 0) {
        carouselX.set(vw);
        return;
      }

      // Calculate target position (last card 20px from right edge)
      const targetX = -(totalCarouselWidth - vw + 20);

      // Calculate progress (0 to 1)
      const progress = Math.min(Math.max(scrollDistance / maxScrollDistance, 0), 1);

      // If animation is complete (progress = 1), keep carousel at final position
      // Otherwise, interpolate from vw (off-screen right) to targetX
      if (progress >= 1) {
        carouselX.set(targetX);
      } else {
        const currentX = vw + progress * (targetX - vw);
        carouselX.set(currentX);
      }
    };

    updateCarouselPosition();
    window.addEventListener("scroll", updateCarouselPosition, { passive: true });
    window.addEventListener("resize", updateCarouselPosition);
    return () => {
      window.removeEventListener("scroll", updateCarouselPosition);
      window.removeEventListener("resize", updateCarouselPosition);
    };
  }, [totalCarouselWidth, viewportWidth, carouselX, aboutSectionVisible, carouselOpacity]);

  // Smooth spring animations
  const smoothX = useSpring(carouselX, {
    stiffness: 100,
    damping: 30,
    mass: 0.5,
  });

  const smoothOpacity = useSpring(carouselOpacity, {
    stiffness: 200,
    damping: 30,
    mass: 0.5,
  });

  return (
    <section
      id="portfolio"
      ref={sectionRef}
      className="section section-portfolio"
      style={{ minHeight: "300vh" }}
    >
      <div className="portfolio-header-sticky" style={{ position: "sticky", top: "4rem", zIndex: 10, textAlign: "right", paddingRight: "2rem" }}>
        <h2 className="portfolio-heading">PORTFOLIO</h2>
      </div>

      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
          zIndex: 1,
          overflow: "hidden",
        }}
      >
        <motion.div
          ref={carouselRef}
          className="portfolio-carousel"
          style={{
            display: "flex",
            gap: "2rem",
            willChange: "transform, opacity",
            pointerEvents: "auto",
            x: smoothX,
            opacity: smoothOpacity,
          }}
        >
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="portfolio-carousel-item"
              style={{
                flexShrink: 0,
                width: `${cardWidth}px`,
                padding: "0.5rem",
              }}
            >
              <div 
                className={`portfolio-card ${project.hasModal ? 'portfolio-card-clickable' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Card clicked:', project.id, 'hasModal:', project.hasModal, 'images:', project.images, 'videoUrl:', project.videoUrl);
                  if (project.hasModal) {
                    // For projects with video, use videoUrl; otherwise use images
                    const imagesToUse = project.videoUrl 
                      ? [] // No images needed if video is present
                      : (project.images && project.images.length > 0 
                        ? project.images 
                        : [placeholderImage1, placeholderImage2]);
                    
                    setSelectedProject({
                      ...project,
                      images: imagesToUse,
                    });
                    setIsModalOpen(true);
                    console.log('Modal opening for:', project.title, 'with videoUrl:', project.videoUrl, 'or images:', imagesToUse);
                  } else {
                    console.log('Modal not opening - hasModal:', project.hasModal);
                  }
                }}
                style={{ cursor: project.hasModal ? 'pointer' : 'default' }}
              >
                <div
                  className="portfolio-media"
                  style={{
                    backgroundImage: `url(${project.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="portfolio-overlay" />
                </div>
                <div className="portfolio-copy">
                  <h3 className="portfolio-title">{project.title}</h3>
                  <div className="portfolio-tags">
                    {project.tags.map((tag) => (
                      <span key={tag} className="portfolio-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Project Detail Modal */}
      <ProjectDetailModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProject(null);
        }}
        project={selectedProject && (selectedProject.images || selectedProject.videoUrl) ? {
          id: selectedProject.id,
          title: selectedProject.title,
          tags: selectedProject.tags,
          images: selectedProject.images || [],
          videoUrl: selectedProject.videoUrl,
          description: selectedProject.description
        } : null}
      />
    </section>
  );
}

export default PortfolioSection;
