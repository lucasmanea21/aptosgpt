import React from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import styles from "../styles/Home.module.css";

const Message = ({ message, index, loading, messages }) => {
  console.log("message", message);
  return (
    <div
      key={index}
      className={`message ${
        message?.type === "userMessage" &&
        loading &&
        index === messages?.length - 1
          ? styles.usermessagewaiting
          : message?.type === "apiMessage"
          ? styles.apimessage
          : styles.usermessage
      }`}
      style={{
        display: "flex",
        justifyContent: "center",
        // alignItems: "center",
      }}
    >
      <div
        className="messageWrapper"
        style={{
          display: "flex",
          width: "80%",
          maxWidth: "800px",
          justifyContent: "flex-start",
        }}
      >
        {/* Display the correct icon depending on the message type */}
        {message.type === "apiMessage" ? (
          <Image
            src="/parroticon.png"
            alt="AI"
            width="40"
            height="40"
            className={styles.boticon}
            priority={true}
          />
        ) : (
          <Image
            src="/usericon.png"
            alt="Me"
            width="40"
            height="40"
            className={styles.usericon}
            priority={true}
          />
        )}
        <div className={styles.markdownanswer}>
          <ReactMarkdown
            linkTarget={"_blank"}
            components={{
              code({ node, inline, className, children, ...props }) {
                if (inline) {
                  return <code {...props}>{children}</code>;
                }

                const match = /```(\w+)/.exec(message.message || "");
                let language = match ? match[1] : undefined;
                // let language = "js";

                return (
                  <div>
                    <div className={styles.codeToolbar}>
                      <span className={styles.codeLanguage}>{language}</span>
                      <button
                        className={styles.copyButton}
                        onClick={() =>
                          navigator.clipboard.writeText(
                            String(children).replace(/\n$/, "")
                          )
                        }
                      >
                        Copy
                      </button>
                    </div>
                    <SyntaxHighlighter
                      {...props}
                      children={String(children).replace(/\n$/, "")}
                      style={vscDarkPlus}
                      language={language}
                      PreTag="div"
                    />
                  </div>
                );
              },
            }}
          >
            {message.message}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default Message;
