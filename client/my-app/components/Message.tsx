import Image from "next/image";
import React from "react";
import userImage from "../public/images/user.png";
import botImage from "../public/images/bot.png";

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
        message.isUser ? "bg-primary ml-auto" : "bg-zinc-900 mr-auto"
      } max-w-sm`}
    >
      <Image
        className="w-10 h-10 rounded-full"
        src={message.isUser ? userImage : botImage}
        alt="Speaker"
        width={100}
        height={100}
      />
      <p className="ml-2 text-sm text-white">{message.content}</p>
    </div>
  );
};

export default Message;
