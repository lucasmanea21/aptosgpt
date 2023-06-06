import { useAtom } from "jotai";
import {
  currentConversationAtom,
  botStreamingMessageAtom,
} from "../store/atom";
import Message from "./Message";
import TextInput from "./TextInput";

interface ConversationDetailProps {
  getStream: (userMessage: string) => void;
}

const ConversationDetail: React.FC<ConversationDetailProps> = ({
  getStream,
}) => {
  const [currentConversation] = useAtom(currentConversationAtom);
  const [botStreamingMessage] = useAtom(botStreamingMessageAtom);

  const messages = [
    ...(currentConversation?.messages || []),
    ...(botStreamingMessage ? [botStreamingMessage] : []),
  ];

  const handleUserMessage = (userMessage: string) => {
    getStream(userMessage);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-secondary">
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
