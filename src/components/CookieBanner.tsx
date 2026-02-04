import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CONSENT_KEY = "wcd-cookie-consent";

function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({
      necessary: true,
      analytics: true,
      timestamp: new Date().toISOString(),
    }));
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({
      necessary: true,
      analytics: false,
      timestamp: new Date().toISOString(),
    }));
    setIsVisible(false);
  };

  const openPrivacyPolicy = () => {
    window.dispatchEvent(new CustomEvent("open-datenschutz"));
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="cookie-banner"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="cookie-banner-content">
          <p className="cookie-banner-text">
            Wir verwenden Cookies, um Ihre Erfahrung zu verbessern und unsere Website zu analysieren.
            {" "}
            <button
              type="button"
              onClick={openPrivacyPolicy}
              className="cookie-banner-link"
              aria-label="Datenschutzerklärung öffnen"
            >
              Mehr erfahren
            </button>
          </p>
          <div className="cookie-banner-actions">
            <button
              type="button"
              onClick={handleDecline}
              className="cookie-banner-btn cookie-banner-btn-secondary"
            >
              Nur notwendige
            </button>
            <button
              type="button"
              onClick={handleAccept}
              className="cookie-banner-btn cookie-banner-btn-primary"
            >
              Alle akzeptieren
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default CookieBanner;
