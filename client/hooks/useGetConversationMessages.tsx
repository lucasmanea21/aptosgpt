import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../utils/supabaseClient";

export default function useConversationMessages(id: string | string[]) {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!id) return;

    fetchMessages(id as string);
  }, [id]);

  async function fetchMessages(conversationId: string) {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error.message);
      return;
    }

    // @ts-ignore
    setMessages(data);
    setLoading(false);
  }

  return { loading, messages };
}
