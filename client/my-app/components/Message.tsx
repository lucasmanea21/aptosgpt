import React from "react";

interface MessageProps {
  message: {
    isUser: boolean;
    content: string;
  };
}

const Message: React.FC<MessageProps> = ({ message }) => {
  return (
    <div
      className={`flex items-start p-4 rounded-md my-2 w-full ${
        message.isUser ? "bg-primary ml-auto" : "bg-secondary-lighter mr-auto"
      } max-w-sm`}
    >
      <img
        className="w-6 h-6 rounded-full"
        src={message.isUser ? "/user.png" : "/bot.png"}
        alt="Speaker"
      />
      <p className="ml-2 text-sm text-white">{message.content}</p>
    </div>
  );
};

export default Message;
