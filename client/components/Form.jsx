import React, { useRef, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import styles from "../styles/Home.module.css";

const Form = ({ handleSubmit, loading, setUserInput, userInput }) => {
  const textAreaRef = useRef(null);

  // Prevent blank submissions and allow for multiline input
  const handleEnter = (e) => {
    if (e.key === "Enter" && userInput) {
      if (!e.shiftKey && userInput) {
        handleSubmit(e);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  // Focus on text field on load
  useEffect(() => {
    textAreaRef.current.focus();
  }, []);

  return (
    <div className={styles.cloudform}>
      <form onSubmit={handleSubmit}>
        <textarea
          onKeyDown={handleEnter}
          ref={textAreaRef}
          autoFocus={false}
          rows={1}
          type="text"
          id="userInput"
          name="userInput"
          placeholder={
            loading ? "Waiting for response..." : "Type your question..."
          }
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className={styles.textarea}
        />
        <button
          type="submit"
          disabled={loading}
          className={styles.generatebutton}
        >
          {loading ? (
            <div className={styles.loadingwheel}>
              <CircularProgress color="inherit" size={20} />{" "}
            </div>
          ) : (
            // Send icon SVG in input field
            <svg
              viewBox="0 0 20 20"
              className={styles.svgicon}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
            </svg>
          )}
        </button>
      </form>
    </div>
  );
};

export default Form;
