import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

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
  // Convert YouTube URL to embed URL
  const getYouTubeEmbedUrl = (url: string): string => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

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
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Debug logging
  useEffect(() => {
    if (isOpen) {
      console.log('Modal isOpen:', isOpen, 'project:', project);
    }
  }, [isOpen, project]);

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
                  {project.id === 'helfair' && project.images.length >= 2 ? (
                    <>
                      {/* Erste zwei Bilder nebeneinander */}
                      <div className="project-modal-images-row">
                        {project.images.slice(0, 2).map((image, index) => (
                          <motion.div
                            key={index}
                            className="project-modal-image-wrapper project-modal-image-side-by-side"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.4 }}
                          >
                            <img
                              src={image}
                              alt={`${project.title} - Image ${index + 1}`}
                              className="project-modal-image"
                              onError={(e) => {
                                console.error('Image failed to load:', image);
                                (e.target as HTMLImageElement).src = `https://via.placeholder.com/800x600/1a1a1a/FFFFFF?text=Image+${index + 1}`;
                              }}
                            />
                          </motion.div>
                        ))}
                      </div>
                      {/* Restliche Bilder untereinander */}
                      {project.images.slice(2).map((image, index) => (
                        <motion.div
                          key={index + 2}
                          className="project-modal-image-wrapper"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: (index + 2) * 0.1, duration: 0.4 }}
                        >
                          <img
                            src={image}
                            alt={`${project.title} - Image ${index + 3}`}
                            className="project-modal-image"
                            onError={(e) => {
                              console.error('Image failed to load:', image);
                              (e.target as HTMLImageElement).src = `https://via.placeholder.com/800x600/1a1a1a/FFFFFF?text=Image+${index + 3}`;
                            }}
                          />
                        </motion.div>
                      ))}
                    </>
                  ) : (
                    /* Normale vertikale Anordnung für andere Projekte */
                    project.images.map((image, index) => (
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
                          onError={(e) => {
                            console.error('Image failed to load:', image);
                            (e.target as HTMLImageElement).src = `https://via.placeholder.com/800x600/1a1a1a/FFFFFF?text=Image+${index + 1}`;
                          }}
                        />
                      </motion.div>
                    ))
                  )}
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

