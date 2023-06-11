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

export const currentConversationAtom = atom<{
  messages: { isUser: boolean; content: string }[];
}>({
  messages: [],
});

export const addMessageToCurrentConversationAtom = atom(
  null,
  (get, set, newMessage) => {
    const currentConversation = get(currentConversationAtom);
    set(currentConversationAtom, {
      messages: [...currentConversation.messages, newMessage],
    });
  }
);

export const conversationsAtom = atom<Conversation[]>([
  {
    title: "Aptos Transactions overview",
    latestMessage: "Hello, how are you?",
    messages: [
      { isUser: true, content: "How do transactions work on Aptos?" },
      {
        isUser: false,
        content: `A transaction may end in one of the following states:
      Committed on the blockchain and executed. This is considered as a successful transaction.
      Committed on the blockchain and aborted. The abort code indicates why the transaction failed to execute.
      Discarded during transaction submission due to a validation check such as insufficient gas, invalid transaction format, or incorrect key.
      Discarded after transaction submission but before attempted execution. This could be caused by timeouts or insufficient gas due to other transactions affecting the account.
      The sender’s account will be charged gas for any committed transactions.`,
      },
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

export const currentMessageAtom = atom<string>("");
export const botResponseAtom = atom<Message[]>([]);
export const botStreamingMessageAtom = atom<Message | null>(null);
