import { useState, useRef, useEffect, Fragment } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";

import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Conversations/Sidebar";
import Conversation from "../components/Conversations/Conversation";

export default function Home() {
  const [history, setHistory] = useState([]);

  // Handles WebSocket messages

  // // Auto scroll chat to bottom
  // useEffect(() => {
  //   const messageList = messageListRef.current;
  //   messageList.scrollTop = messageList.scrollHeight;
  // }, [messages]);

  // Handle errors

  // Keep history in sync with messages
  // useEffect(() => {
  //   if (messages.length >= 3) {
  //     setHistory([
  //       [
  //         messages[messages.length - 2].message,
  //         messages[messages.length - 1].message,
  //       ],
  //     ]);
  //   }
  // }, [messages]);

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
          <div className="flex justify-center w-full h-full">
            <Sidebar />
            <Conversation />
          </div>
        </div>
        <div className={styles.center}>{/* <Footer /> */}</div>
      </main>
    </div>
  );
}
