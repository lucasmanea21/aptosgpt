import { atom } from "jotai";

interface Message {
  isUser: boolean;
  content: string;
}

interface Conversation {
  title: string;
  latestMessage: string;
  messages: Message[];
}

export const conversationsAtom = atom<Conversation[]>([
  {
    title: "Conversation 1",
    latestMessage: "Hello, how are you?",
    messages: [
      { isUser: true, content: "Hello!" },
      { isUser: false, content: "Hi, how can I help you?" },
      { isUser: true, content: "I need some help." },
    ],
  },
  {
    title: "Conversation 2",
    latestMessage: "Okay, I understand.",
    messages: [
      { isUser: true, content: "Could you explain more about this?" },
      { isUser: false, content: "Sure, here's some more information..." },
    ],
  },
]);

export const currentConversationAtom = atom<Conversation | null>(null);

export const currentMessageAtom = atom<string>("");
export const botResponseAtom = atom<Message[]>([]);
export const botStreamingMessageAtom = atom<Message | null>(null);
