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
    </footer>
  );
}

export default Footer;
