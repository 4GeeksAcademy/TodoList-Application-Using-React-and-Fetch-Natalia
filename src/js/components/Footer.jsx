import React from "react";

const Footer = () => {
  return (
    <footer className="footer">
      © {new Date().getFullYear()} Created by Natalia |{" "}
      <a
        href="https://github.com/NatiSen"
        target="_blank"
        rel="noopener noreferrer"
      >
        GitHub
      </a>
    </footer>
  );
};

export default Footer;
