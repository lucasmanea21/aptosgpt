import React, { useState } from "react";
import Conversation from "../Conversations/ConversationPreview";
import ConversationPreview from "../Conversations/ConversationPreview";
import useGetUserConversations from "../../hooks/useUserConversations";
import Model from "./Models";
import Profile from "./Profile";

const Sidebar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const { loading, conversations } = useGetUserConversations(
    "20c9875d-5f6a-4a10-b178-63fdb11b1a9a"
  );

  console.log("conversations", conversations);
  return (
    <div className=" max-h-screen flex   items-center flex-col h-full w-1/5 bg-[#141619]">
      <div className="flex flex-col py-5 max-h-screen my-5 w-[90%] h-full justify-between items-center">
        <div className="w-full">
          <Model />
          {!isLoggedIn ? (
            <div className="w-2/3 mt-40 text-center">
              <p className="text-gray-300 font-extralight">Coming soon.</p>
            </div>
          ) : (
            <div className="mt-10 w-[95%] rounded-md">
              {conversations.map(({ summary, id }) => {
                return (
                  <ConversationPreview
                    key={id}
                    conversationName={summary}
                    id={id}
                    active={false}
                  />
                );
              })}
            </div>
          )}
        </div>
        <div>{/* <Profile /> */}</div>
      </div>
    </div>
  );
};

export default Sidebar;
