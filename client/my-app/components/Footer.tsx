import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="flex items-center justify-center p-4 text-white bg-secondary">
      <p>© {new Date().getFullYear()} AptosGPT. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
