import React from "react";
import { Auth } from "@supabase/auth-ui-react";
import Navbar from "../components/Navbar";
import { supabase } from "../utils/supabaseClient";
import { ThemeSupa } from "@supabase/auth-ui-shared";

const AuthPage = () => {
  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center w-full h-[90vh]">
        <div className="max-w-[400px] w-full">
          <Auth
            supabaseClient={supabase}
            providers={["google", "facebook", "twitter"]}
            appearance={{ theme: ThemeSupa }}
          />
        </div>
      </div>
    </>
  );
};

export default AuthPage;
