function ContactSection() {
  return (
    <section id="contact" className="section section-contact">
      <div className="container">
        <header className="section-header" style={{ textAlign: "left", paddingLeft: "2rem", maxWidth: "none", width: "100%" }}>
          <h2 className="hero-heading" style={{ fontSize: "clamp(3.1rem, 5.6vw, 4.4rem)" }}>
            KONTAKT
          </h2>
          <p className="section-intro">
            Platzhalter für dein Kontaktformular und direkte Kontaktdaten.
          </p>
        </header>

        <div className="contact-layout" style={{ marginTop: "2.6rem" }}>
          <form className="contact-form glass">
            <div className="form-field">
              <label htmlFor="name">Name</label>
              <input id="name" name="name" type="text" />
            </div>
            <div className="form-field">
              <label htmlFor="email">E-Mail *</label>
              <input id="email" name="email" type="email" required />
            </div>
            <div className="form-field">
              <label htmlFor="service">Dienstleistung</label>
              <select id="service" name="service" className="form-select">
                <option value="">Bitte wählen...</option>
                <option value="webdesign">Webdesign</option>
                <option value="brand-identity">Brand Identity</option>
                <option value="webshops">Webshops</option>
                <option value="3d-animation">3D-Animation</option>
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="budget">Budget</label>
              <select id="budget" name="budget" className="form-select">
                <option value="">Bitte wählen...</option>
                <option value="<5000">&lt; 5.000 €</option>
                <option value="5000-15000">5.000 – 15.000 €</option>
                <option value=">15000">&gt; 15.000 €</option>
              </select>
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
            <h3 className="accent-heading">Direct Contact</h3>
            <p>
              Hier kannst du deine direkten Kontaktdaten oder ein kurzes
              Onboarding-Statement platzieren.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
