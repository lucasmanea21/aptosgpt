import React, { useState } from "react";
import Conversation from "./ConversationPreview";
import ConversationPreview from "./ConversationPreview";
import useGetUserConversations from "../../hooks/useGetUserConversations";

const Sidebar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { loading, conversations } = useGetUserConversations(
    "20c9875d-5f6a-4a10-b178-63fdb11b1a9a"
  );

  console.log("conversations", conversations);
  return (
    <div className="relative flex flex-col items-center justify-start w-1/5 h-full bg-[#141619]">
      <p className="absolute text-lg top-10">Chat History</p>

      {!isLoggedIn ? (
        <div className="w-2/3 mt-40 text-center">
          <p className="text-gray-300 font-extralight">Coming soon.</p>{" "}
        </div>
      ) : (
        <div className="mt-40 w-[95%] rounded-md">
          {conversations.map(({ summary, id }) => {
            return (
              <ConversationPreview
                conversationName={summary}
                id={id}
                active={false}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
