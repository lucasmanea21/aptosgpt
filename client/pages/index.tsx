import { useState, useRef, useEffect, Fragment } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";

import Message from "../components/Message";
import Form from "../components/Form";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function Home() {
  const [userInput, setUserInput] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Hi there! How can I help?",
      type: "apiMessage",
    },
  ]);
  const [isWsOpen, setIsWsOpen] = useState(false);

  const messageListRef = useRef(null);

  const webSocket = useRef(null);

  // Handles WebSocket messages
  const handleResponse = (response) => {
    if (
      response.sender !== "you" &&
      response.message &&
      response.type == "stream"
    ) {
      setMessages((prevMessages) => {
        const lastMessageSender = prevMessages[prevMessages.length - 1].type;

        return [
          // Handle streaming messages
          ...prevMessages.slice(
            0,
            lastMessageSender == "apiMessage" ? -1 : prevMessages.length
          ),
          {
            message:
              lastMessageSender == "apiMessage"
                ? prevMessages[prevMessages.length - 1].message +
                  response.message
                : response.message,
            type: response.sender === "bot" ? "apiMessage" : "error",
          },
        ];
      });
    }

    // todo: handle error
    if (response.type === "end" || response.type === "error") {
      setLoading(false);
    }
  };

  useEffect(() => {
    webSocket.current = new WebSocket(
      `ws://${process.env.NEXT_PUBLIC_LCC_ENDPOINT_URL}/chat`
    );

    webSocket.current.onopen = () => {
      console.log("WebSocket opened");
      setIsWsOpen(true);
    };
    // Listen for messages
    webSocket.current.onmessage = (event) => {
      handleResponse(JSON.parse(event.data));
    };

    webSocket.current.onerror = () => {
      console.log("WebSocket error");
      setLoading(false);
      handleError();
    };
    webSocket.current.onclose = () => {
      console.log("WebSocket closed");
      setLoading(false);
      setIsWsOpen(false);
    };

    // return () => {
    //   webSocket.current.close();
    // };
  }, [webSocket]);

  // // Auto scroll chat to bottom
  // useEffect(() => {
  //   const messageList = messageListRef.current;
  //   messageList.scrollTop = messageList.scrollHeight;
  // }, [messages]);

  // Handle errors
  const handleError = () => {
    // setMessages((prevMessages) => [
    //   ...prevMessages,
    //   {
    //     message: "Oops! There seems to be an error. Please try again.",
    //     type: "apiMessage",
    //   },
    // ]);
    // setLoading(false);
    // setUserInput("");
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userInput.trim() === "" || !isWsOpen) {
      return;
    }

    setLoading(true);
    setMessages((prevMessages) => [
      ...prevMessages,
      { message: userInput, type: "userMessage" },
    ]);

    if (webSocket.current) {
      webSocket.current.send(userInput);
      setUserInput("");
    } else {
      handleError();
    }
  };

  // Keep history in sync with messages
  useEffect(() => {
    if (messages.length >= 3) {
      setHistory([
        [
          messages[messages.length - 2].message,
          messages[messages.length - 1].message,
        ],
      ]);
    }
  }, [messages]);

  return (
    <div style={{ height: "100vh", overflow: "hidden" }}>
      <Head>
        <title>LangChain Chat</title>
        <meta name="description" content="LangChain documentation chatbot" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.cloud}>
          <div className={styles.upperBar}>Model: aptos-extended</div>
          <div ref={messageListRef} className={styles.messagelist}>
            {messages.map((message, index) => {
              return (
                <Message
                  message={message}
                  messages={messages}
                  index={index}
                  loading={loading}
                />
              );
            })}
          </div>
        </div>
        <div className={styles.center}>
          {/* TODO: switch to jotai to handle global state */}
          <Form
            handleSubmit={handleSubmit}
            setUserInput={setUserInput}
            userInput={userInput}
            loading={loading}
          />
          <Footer />
        </div>
      </main>
    </div>
  );
}
