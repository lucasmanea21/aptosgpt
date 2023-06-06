"use client";
import React from "react";
import ChatWindow from "../../../components/ChatWindow";
import Navbar from "../../../components/Navbar";

const Chat = () => {
  return (
    <>
      <Navbar />

      <div className="flex items-center justify-center w-full h-screen">
        <div className="w-4/5 overflow-hidden rounded-md h-4/5 bg-secondary">
          <ChatWindow />
        </div>
      </div>
    </>
  );
};

export default Chat;
