import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";

const useModels = () => {
  const [models, setModels] = useState<any>([]);

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    let { data, error } = await supabase.from("models").select("*");

    if (error) {
      console.log("error", error);
    } else {
      setModels(data);
    }
  };

  return models;
};

export default useModels;
