import { useAtom } from "jotai";
import {
  currentConversationAtom,
  botStreamingMessageAtom,
  addMessageToCurrentConversationAtom,
} from "../store/atom";
import Message from "./Message";
import TextInput from "./TextInput";

interface ConversationDetailProps {
  getStream: (userMessage: string) => void;
}

import ProjectInfo from "./ProjectInfo";
import { useState } from "react";

const ConversationDetail: React.FC<ConversationDetailProps> = ({
  getStream,
}) => {
  const [currentConversation] = useAtom(currentConversationAtom);
  const [botStreamingMessage] = useAtom(botStreamingMessageAtom);
  const [hasUserStartedChat, setHasUserStartedChat] = useState(false);
  const [, addMessageToConversation] = useAtom(
    addMessageToCurrentConversationAtom
  );

  const messages = [
    ...(currentConversation?.messages || []),
    ...(botStreamingMessage ? [botStreamingMessage] : []),
  ];

  const handleUserMessage = (userMessage: string) => {
    setHasUserStartedChat(true);
    addMessageToConversation({ isUser: true, content: userMessage });
    getStream(userMessage);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-zinc-700">
      {/* {!hasUserStartedChat && <ProjectInfo />} */}
      <div className="flex-grow overflow-y-scroll">
        {messages.map((message, index) => (
          <Message key={index} message={message} />
        ))}
      </div>
      <TextInput onSend={handleUserMessage} />
    </div>
  );
};

export default ConversationDetail;
