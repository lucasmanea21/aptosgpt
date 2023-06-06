import React from "react";
import { useAtom } from "jotai";
import { conversationsAtom, currentConversationAtom } from "../store/atom";

interface Conversation {
  title: string;
  latestMessage: string;
}

const ConversationList: React.FC = () => {
  const [conversations] = useAtom(conversationsAtom) as [Conversation[]];
  const [, setCurrentConversation] = useAtom(currentConversationAtom);

  return (
    <div className="h-full overflow-y-scroll bg-secondary-lighter">
      {conversations.map((conversation, index) => (
        <div
          key={index}
          className="p-4 text-white cursor-pointer hover:bg-primary"
          onClick={() => setCurrentConversation(conversation)}
        >
          <h2 className="font-semibold">{conversation.title}</h2>
          <p className="text-sm">{conversation.latestMessage}</p>
        </div>
      ))}
    </div>
  );
};

export default ConversationList;
