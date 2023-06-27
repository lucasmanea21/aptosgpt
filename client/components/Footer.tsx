import React from "react";
import styles from "../styles/Home.module.css";

const Footer = () => {
  return (
    <div className={styles.footer}>
      <p>
        Powered by{" "}
        <a href="https://github.com/hwchase17/langchain" target="_blank">
          LangChain
        </a>
        . Built by{" "}
        <a href="https://twitter.com/lucasmanea21" target="_blank">
          Lucas
        </a>
        .
      </p>
    </div>
  );
};

export default Footer;
