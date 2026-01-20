import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface ProjectDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    id: string;
    title: string;
    tags: string[];
    images?: string[];
    videoUrl?: string;
    description?: string;
  } | null;
}

function ProjectDetailModal({ isOpen, onClose, project }: ProjectDetailModalProps) {
  const [imageOrientations, setImageOrientations] = useState<Record<number, 'portrait' | 'landscape'>>({});

  // Convert YouTube URL to embed URL
  const getYouTubeEmbedUrl = (url: string): string => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  // Check image orientation
  const checkImageOrientation = (imageUrl: string, index: number) => {
    const img = new Image();
    img.onload = () => {
      const isPortrait = img.height > img.width;
      setImageOrientations(prev => ({
        ...prev,
        [index]: isPortrait ? 'portrait' : 'landscape'
      }));
    };
    img.onerror = () => {
      // Fallback: assume landscape if image fails to load
      setImageOrientations(prev => ({
        ...prev,
        [index]: 'landscape'
      }));
    };
    img.src = imageUrl;
  };

  // Check all images when project changes
  useEffect(() => {
    if (project?.images) {
      setImageOrientations({});
      project.images.forEach((image, index) => {
        checkImageOrientation(image, index);
      });
    }
  }, [project?.images]);

  // Close modal on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
      // Add class to body to hide header
      document.body.classList.add("modal-open");
      // Also add to html element for extra specificity
      document.documentElement.classList.add("modal-open");
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
      // Remove class from body to show header again
      document.body.classList.remove("modal-open");
      document.documentElement.classList.remove("modal-open");
    };
  }, [isOpen, onClose]);


  if (!project || !isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with glassmorphism */}
          <motion.div
            className="project-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            className="project-modal-content"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
            }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* Close Button */}
            <button
              className="project-modal-close"
              onClick={onClose}
              aria-label="Close modal"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {/* Header */}
            <div className="project-modal-header">
              <h2 className="project-modal-title">{project.title}</h2>
              <div className="project-modal-tags">
                {project.tags.map((tag) => (
                  <span key={tag} className="project-modal-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Description Text */}
            {project.description && (
              <div className="project-modal-description">
                {project.description.split('\n').map((paragraph, index) => (
                  <p key={index} className="project-modal-description-paragraph">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}

            {/* Video or Image Gallery */}
            <div className={`project-modal-gallery ${project.id === 'helfair' ? 'project-modal-gallery-helfair' : ''}`}>
              {project.videoUrl ? (
                /* YouTube Video */
                <motion.div
                  className="project-modal-video-wrapper"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="project-modal-video-container">
                    <iframe
                      src={getYouTubeEmbedUrl(project.videoUrl)}
                      title={`${project.title} - Video`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="project-modal-video"
                    />
                  </div>
                </motion.div>
              ) : project.images && project.images.length > 0 ? (
                <>
                  {(() => {
                    // Gruppiere Bilder basierend auf Ausrichtung
                    const portraitImages: { image: string; index: number }[] = [];
                    const landscapeImages: { image: string; index: number }[] = [];
                    
                    project.images.forEach((image, index) => {
                      const orientation = imageOrientations[index];
                      if (orientation === 'portrait') {
                        portraitImages.push({ image, index });
                      } else {
                        landscapeImages.push({ image, index });
                      }
                    });

                    // Wenn Orientierung noch nicht bekannt ist, zeige alle einzeln
                    const allOrientationsKnown = project.images.every((_, index) => imageOrientations[index] !== undefined);
                    
                    if (!allOrientationsKnown) {
                      // Fallback: zeige alle Bilder einzeln während des Ladens
                      return project.images.map((image, index) => (
                        <motion.div
                          key={index}
                          className="project-modal-image-wrapper"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.4 }}
                        >
                          <img
                            src={image}
                            alt={`${project.title} - Image ${index + 1}`}
                            className="project-modal-image"
                            onLoad={() => checkImageOrientation(image, index)}
                            onError={(e) => {
                              console.error('Image failed to load:', image);
                              (e.target as HTMLImageElement).src = `https://via.placeholder.com/800x600/1a1a1a/FFFFFF?text=Image+${index + 1}`;
                            }}
                          />
                        </motion.div>
                      ));
                    }

                    const result: JSX.Element[] = [];
                    let animationIndex = 0;

                    // Verarbeite alle Bilder in Reihenfolge
                    let portraitIndex = 0;
                    let landscapeIndex = 0;
                    let currentPortraitGroup: { image: string; index: number }[] = [];

                    project.images.forEach((image, originalIndex) => {
                      const orientation = imageOrientations[originalIndex];
                      
                      if (orientation === 'portrait') {
                        currentPortraitGroup.push({ image, index: originalIndex });
                        
                        // Wenn 2 Portrait-Bilder gesammelt oder letztes Bild, zeige sie nebeneinander
                        if (currentPortraitGroup.length === 2 || originalIndex === project.images.length - 1) {
                          result.push(
                            <div key={`portrait-group-${portraitIndex}`} className="project-modal-images-row">
                              {currentPortraitGroup.map((item, groupIndex) => (
                                <motion.div
                                  key={item.index}
                                  className="project-modal-image-wrapper project-modal-image-side-by-side"
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: animationIndex * 0.1, duration: 0.4 }}
                                >
                                  <img
                                    src={item.image}
                                    alt={`${project.title} - Image ${item.index + 1}`}
                                    className="project-modal-image"
                                    onError={(e) => {
                                      console.error('Image failed to load:', item.image);
                                      (e.target as HTMLImageElement).src = `https://via.placeholder.com/800x600/1a1a1a/FFFFFF?text=Image+${item.index + 1}`;
                                    }}
                                  />
                                </motion.div>
                              ))}
                            </div>
                          );
                          animationIndex += currentPortraitGroup.length;
                          currentPortraitGroup = [];
                          portraitIndex++;
                        }
                      } else {
                        // Wenn Portrait-Gruppe vorhanden, zeige sie zuerst
                        if (currentPortraitGroup.length > 0) {
                          result.push(
                            <div key={`portrait-group-${portraitIndex}`} className="project-modal-images-row">
                              {currentPortraitGroup.map((item) => (
                                <motion.div
                                  key={item.index}
                                  className="project-modal-image-wrapper project-modal-image-side-by-side"
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: animationIndex * 0.1, duration: 0.4 }}
                                >
                                  <img
                                    src={item.image}
                                    alt={`${project.title} - Image ${item.index + 1}`}
                                    className="project-modal-image"
                                    onError={(e) => {
                                      console.error('Image failed to load:', item.image);
                                      (e.target as HTMLImageElement).src = `https://via.placeholder.com/800x600/1a1a1a/FFFFFF?text=Image+${item.index + 1}`;
                                    }}
                                  />
                                </motion.div>
                              ))}
                            </div>
                          );
                          animationIndex += currentPortraitGroup.length;
                          currentPortraitGroup = [];
                          portraitIndex++;
                        }
                        
                        // Querformat-Bild einzeln anzeigen
                        result.push(
                          <motion.div
                            key={originalIndex}
                            className="project-modal-image-wrapper"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: animationIndex * 0.1, duration: 0.4 }}
                          >
                            <img
                              src={image}
                              alt={`${project.title} - Image ${originalIndex + 1}`}
                              className="project-modal-image"
                              onError={(e) => {
                                console.error('Image failed to load:', image);
                                (e.target as HTMLImageElement).src = `https://via.placeholder.com/800x600/1a1a1a/FFFFFF?text=Image+${originalIndex + 1}`;
                              }}
                            />
                          </motion.div>
                        );
                        animationIndex++;
                        landscapeIndex++;
                      }
                    });

                    // Wenn noch Portrait-Bilder in der Gruppe sind
                    if (currentPortraitGroup.length > 0) {
                      result.push(
                        <div key={`portrait-group-${portraitIndex}`} className="project-modal-images-row">
                          {currentPortraitGroup.map((item) => (
                            <motion.div
                              key={item.index}
                              className="project-modal-image-wrapper project-modal-image-side-by-side"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: animationIndex * 0.1, duration: 0.4 }}
                            >
                              <img
                                src={item.image}
                                alt={`${project.title} - Image ${item.index + 1}`}
                                className="project-modal-image"
                                onError={(e) => {
                                  console.error('Image failed to load:', item.image);
                                  (e.target as HTMLImageElement).src = `https://via.placeholder.com/800x600/1a1a1a/FFFFFF?text=Image+${item.index + 1}`;
                                }}
                              />
                            </motion.div>
                          ))}
                        </div>
                      );
                    }

                    return result;
                  })()}
                </>
              ) : (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                  No images available
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default ProjectDetailModal;

