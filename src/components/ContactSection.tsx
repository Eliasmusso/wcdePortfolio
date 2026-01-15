function ContactSection() {
  return (
    <section id="contact" className="section section-contact">
      <div className="container">
        <header className="section-header" style={{ textAlign: "left", paddingLeft: "2rem", maxWidth: "none", width: "100%" }}>
          <h2 className="hero-heading" style={{ fontSize: "clamp(3.1rem, 5.6vw, 4.4rem)" }}>
            CONTACT
          </h2>
        </header>

        <div className="contact-layout" style={{ marginTop: "2.6rem" }}>
          <form className="contact-form glass">
            <div className="form-field">
              <label htmlFor="name">Name *</label>
              <input id="name" name="name" type="text" required />
            </div>
            <div className="form-field">
              <label htmlFor="email">E-Mail *</label>
              <input id="email" name="email" type="email" required />
            </div>
            <div className="form-field">
              <label htmlFor="service">Service *</label>
              <select id="service" name="service" className="form-select" required>
                <option value="">Bitte wählen...</option>
                <option value="webdesign">Webdesign</option>
                <option value="brand-identity">Brand Identity</option>
                <option value="webshop">Webshop</option>
                <option value="3d-design">3D Design</option>
                <option value="ki-automation">KI Automation</option>
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="budget">Budget</label>
              <input 
                id="budget" 
                name="budget" 
                type="number" 
                placeholder="Available Budget"
                min="0"
                step="100"
              />
            </div>
            <div className="form-field">
              <label htmlFor="message">Nachricht *</label>
              <textarea id="message" name="message" rows={6} required />
            </div>
            <button type="submit" className="btn-cta contact-submit">
              SENDEN
            </button>
          </form>

          <aside className="contact-card glass">
            <p className="contact-location">
              Based in Berlin & Konstanz, operating internationally
            </p>
            <div className="social-links">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
                aria-label="Instagram"
              >
                Instagram
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
                aria-label="LinkedIn"
              >
                LinkedIn
              </a>
              <a 
                href="mailto:contact@example.com" 
                className="social-link"
                aria-label="Email"
              >
                Email
              </a>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
