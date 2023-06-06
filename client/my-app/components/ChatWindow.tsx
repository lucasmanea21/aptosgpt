import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { OpenAI } from "openai-streams";
import {
  botResponseAtom,
  botStreamingMessageAtom,
  currentMessageAtom,
} from "../store/atom";
import ConversationList from "./ConversationList";
import ConversationDetail from "./ConversationDetail";

const ChatWindow: React.FC = () => {
  const [stream, setStream] = useState<any>(null);
  const [botResponse, setBotResponse] = useAtom(botResponseAtom);
  const [, setBotStreamingMessage] = useAtom(botStreamingMessageAtom);
  const [currentMessage, setCurrentMessage] = useAtom(currentMessageAtom);

  const getStream = async () => {
    console.log("called getStream, currentMessage is: ", currentMessage);
    const stream = await OpenAI(
      "completions",
      {
        model: "davinci:ft-personal-2023-06-03-16-33-32",
        prompt: currentMessage,
        max_tokens: 100,
      },
      { apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, mode: "tokens" }
    );
    setStream(stream);
    setBotStreamingMessage({ isUser: false, content: "" });
  };

  const readStream = async () => {
    if (stream) {
      const textDecoder = new TextDecoder();
      const reader = stream.getReader();
      let result = await reader.read();
      while (!result.done) {
        let decodedData = textDecoder.decode(result.value);
        setBotStreamingMessage((prevMessage) => {
          if (prevMessage) {
            return {
              ...prevMessage,
              content: prevMessage.content + decodedData,
            };
          }
          return { isUser: false, content: decodedData };
        });
        result = await reader.read();
      }
    }
  };

  // call readStream whenever the stream changes
  useEffect(() => {
    readStream();
  }, [stream]);

  return (
    <div className="flex w-full h-full dark">
      <div className="w-1/4 border-r border-primary">
        <ConversationList />
      </div>
      <div className="w-3/4">
        <ConversationDetail getStream={getStream} />
      </div>
    </div>
  );
};

export default ChatWindow;
