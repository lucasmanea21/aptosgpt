import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function useGetUserConversations(userId: string) {
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<any[]>([]);

  console.log("userId", userId);

  useEffect(() => {
    fetchConversations(userId);
  }, [userId]);

  async function fetchConversations(userId: string) {
    console.log("ran fetching");
    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (error) {
      console.log(error.message);
      return;
    }

    console.log("data", data);

    setConversations(data);
    setLoading(false);
  }

  return { loading, conversations };
}
