import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";

const useUser = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const session = supabase.auth.session();

    setUser(session?.user ?? null);

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const currentUser = session ? session.user : null;
        setUser(currentUser);
      }
    );

    return () => {
      authListener.unsubscribe();
    };
  }, []);

  return user;
};

export default useUser;
