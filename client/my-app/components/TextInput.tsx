import React, { useState } from "react";
import { useAtom } from "jotai";
import { currentMessageAtom } from "../store/atom";

interface TextInputProps {
  onSend: (message: string) => void;
}

const TextInput: React.FC<TextInputProps> = ({ onSend }) => {
  const [message, setMessage] = useState("");
  const [currentMessage, setCurrentMessage] = useAtom(currentMessageAtom);

  const handleSend = () => {
    if (currentMessage.trim() !== "") {
      onSend(currentMessage);
      setCurrentMessage("");
    }
  };

  return (
    <div className="p-3 bg-primary">
      <div className="relative">
        <input
          type="text"
          placeholder="Type a message"
          className="w-full px-3 py-2 text-lg leading-tight text-gray-700 bg-white border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
        />
        <div className="absolute top-0 right-0 mt-2 mr-2">
          <button
            className="px-5 py-2 text-white bg-blue-500 rounded hover:bg-blue-400"
            onClick={handleSend}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextInput;
