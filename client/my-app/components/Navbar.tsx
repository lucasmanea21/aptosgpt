"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { FaGithub, FaTwitter } from "react-icons/fa";

const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className="flex items-center justify-between p-4 text-white bg-secondary">
      <h1 className="text-2xl cursor-pointer" onClick={() => router.push("/")}>
        AptosGPT
      </h1>
      <div>
        {pathname !== "/chat" && (
          <button
            className="px-2 py-1 mr-4 text-white rounded-md bg-primary"
            onClick={() => router.push("/chat")}
          >
            Go to chat
          </button>
        )}
        <a href="https://github.com" target="_blank" rel="noreferrer">
          <FaGithub className="inline mr-4" />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noreferrer">
          <FaTwitter className="inline" />
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
