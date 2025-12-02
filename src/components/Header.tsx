import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import logoSvg from "../assets/assets/logo.svg";

const navItems = [
  { id: "home", label: "Home" },
  { id: "services", label: "Services" },
  { id: "portfolio", label: "Portfolio" },
  { id: "contact", label: "Contact" },
];

function Header() {
  const [active, setActive] = useState<string>("home");
  const [expanded, setExpanded] = useState(false);
  const [interactionTick, setInteractionTick] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const clearCollapseTimer = () => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const bumpInteraction = () => {
    setInteractionTick((t) => t + 1);
  };

  useEffect(() => {
    if (!expanded || isHovering) {
      clearCollapseTimer();
      return;
    }

    clearCollapseTimer();
    timeoutRef.current = window.setTimeout(() => {
      setExpanded(false);
    }, 5000);

    return clearCollapseTimer;
  }, [expanded, interactionTick, isHovering]);

  return (
    <header className="site-header">
      <motion.div
        className="container header-shell"
        layout
        onMouseEnter={() => {
          setIsHovering(true);
          clearCollapseTimer();
        }}
        onMouseLeave={() => {
          setIsHovering(false);
          if (expanded) bumpInteraction();
        }}
      >
        <motion.div
          className="header-pill"
          layout
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
        >
          <motion.div
            className="logo"
            layout
            onClick={() => {
              if (!expanded) {
                setExpanded(true);
              } else {
                bumpInteraction();
              }
            }}
            style={{ cursor: expanded ? "default" : "pointer" }}
          >
            <img src={logoSvg} alt="WCD(E) Logo" style={{ height: "28px" }} />
          </motion.div>

          {expanded && (
            <>
              <nav className="main-nav">
                <ul>
                  {navItems.map((item) => (
                    <li
                      key={item.id}
                      className="relative"
                      onClick={() => {
                        setActive(item.id);
                        bumpInteraction();
                      }}
                    >
                      <a href={`#${item.id}`}>{item.label}</a>
                    </li>
                  ))}
                </ul>
              </nav>

              <a
                href="#contact"
                className="btn-cta"
                onClick={() => bumpInteraction()}
              >
                Let&apos;s Talk
              </a>
            </>
          )}
        </motion.div>
      </motion.div>
    </header>
  );
}

export default Header;


