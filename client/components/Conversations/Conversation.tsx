import React, { useRef, useState, useEffect } from "react";

import styles from "../../styles/Home.module.css";
import { useRouter } from "next/router";
import Message from "../Message";
import Form from "../Form";
import useConversationMessages from "../../hooks/useGetConversationMessages";

const Conversation = () => {
  const router = useRouter();
  const { conversation } = router.query;

  const { loading: conversationLoading, messages: conversationMessages } =
    useConversationMessages(conversation as string);

  const [userInput, setUserInput] = useState("");
  const [isWsOpen, setIsWsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<any[]>([
    {
      message: `Hi! How can I help you?`,
      type: "apiMessage",
    },
  ]);

  const messageListRef = useRef(null);
  const webSocket = useRef<WebSocket | null>(null);

  console.log("conversationMessages", conversationMessages);

  useEffect(() => {
    if ((messages?.length ?? 1) === 0) {
      conversationMessages.forEach(({ message, type }) => {
        setMessages((prevMessages) => [...prevMessages, { message, type }]);
      });
    }
  }, [conversationMessages, conversation]);

  // Handle form submission
  const handleSubmit = async (e: any) => {
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

  const handleResponse = (response: any) => {
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

    if (webSocket.current !== null) {
      webSocket.current.onopen = () => {
        console.log("WebSocket opened");
        setIsWsOpen(true);
      };
    }
    // Listen for messages
    webSocket.current.onmessage = (event: MessageEvent) => {
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

  return (
    <div ref={messageListRef} className={styles.messagelist}>
      <div className="w-full">
        <div className={styles.upperBar}>Model: aptos-extended</div>
        {messages?.map((message, index) => {
          return (
            <Message
              message={message}
              messages={messages}
              index={index}
              key={index}
              loading={loading}
            />
          );
        })}
      </div>

      <div className="absolute flex items-center justify-center w-2/3 bottom-5">
        <Form
          handleSubmit={handleSubmit}
          setUserInput={setUserInput}
          userInput={userInput}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default Conversation;
