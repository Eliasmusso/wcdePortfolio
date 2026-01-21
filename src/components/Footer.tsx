import logoWhite from "../assets/assets/WCD(E)_LogoWeiß.svg";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-logo-container">
        <img 
          src={logoWhite} 
          alt="WCD(E)" 
          className="footer-logo"
        />
      </div>
      <div className="footer-bottom">
        <div className="footer-copyright">
          <p>Warcord Enterprise - All rights reserved</p>
        </div>
        <div className="footer-links">
          <div className="footer-column">
            <h4 className="footer-column-title">SOCIALS</h4>
            <div className="footer-column-links">
              <a 
                href="https://www.linkedin.com/company/warcord-enterprise/?viewAsMember=true" 
                target="_blank" 
                rel="noopener noreferrer"
                className="footer-link"
              >
                Linkedin
              </a>
              <a 
                href="https://www.instagram.com/warcordenterprise?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
                target="_blank" 
                rel="noopener noreferrer"
                className="footer-link"
              >
                Instagram
              </a>
            </div>
          </div>
          <div className="footer-column">
            <h4 className="footer-column-title">BORING STUFF</h4>
            <div className="footer-column-links">
              <a href="#imprint" className="footer-link">
                Imprint
              </a>
              <a href="#datenschutz" className="footer-link">
                Datenschutz
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
