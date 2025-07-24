import React from "react";

const Footer = ({ theme }: { theme: string }) => (
  <footer className={`footer-root ${theme}`}>
    <p className="footer-text">
      Data provided by <a href="https://swapi.info" className="footer-link" target="_blank" rel="noopener noreferrer">SWAPI</a>. Not affiliated with Lucasfilm or Disney.
    </p>
  </footer>
);

export default Footer;