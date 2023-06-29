import React from "react";
import { FiMessageSquare } from "react-icons/fi";
import Link from "next/link";

interface ConversationPreviewProps {
  id: string;
  conversationName: string;
  active: boolean;
}

const ConversationPreview: React.FC<ConversationPreviewProps> = ({
  id,
  conversationName,
  active,
}) => {
  const bgColor = active ? "bg-[#070809]" : "hover:bg-[#070809]";

  return (
    <Link href={`?conversation=${id}`}>
      <div
        className={`flex items-center p-4 cursor-pointer ${bgColor} rounded-lg`}
      >
        <FiMessageSquare className="mr-3 text-lg" />
        <p className="text-sm">{conversationName}</p>
      </div>
    </Link>
  );
};

export default ConversationPreview;
