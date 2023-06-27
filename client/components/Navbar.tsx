import React from "react";
import styles from "../styles/Home.module.css";

const Navbar = () => {
  return (
    <div className={styles.topnav}>
      <div className={styles.navlogo}>
        <a href="/">LangChain</a>
      </div>
      <div className={styles.navlinks}>
        <a href="https://langchain.readthedocs.io/en/latest/" target="_blank">
          Docs
        </a>
        <a
          href="https://github.com/zahidkhawaja/langchain-chat-nextjs"
          target="_blank"
        >
          GitHub
        </a>
      </div>
    </div>
  );
};

export default Navbar;
