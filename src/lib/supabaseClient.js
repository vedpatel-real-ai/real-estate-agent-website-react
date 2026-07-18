import { createClient } from "@supabase/supabase-js";
import { createDemoSupabaseClient } from "../demo/demoServices.js";

const env =
  typeof import.meta !== "undefined" && import.meta.env ? import.meta.env : {};
const supabaseUrl = env.VITE_SUPABASE_URL?.trim() || "";
const supabaseKey = env.VITE_SUPABASE_ANON_KEY?.trim() || "";

const isValidSupabaseConfig = (url, key) => {
  if (!url || !key) return false;

  const placeholderValues = [
    "your-project.supabase.co",
    "your-anon-key",
    "placeholder",
  ];
  if (
    placeholderValues.some(
      (value) => url.includes(value) || key.includes(value),
    )
  ) {
    return false;
  }

  try {
    const parsedUrl = new URL(url);
    return ["http:", "https:"].includes(parsedUrl.protocol);
  } catch {
    return false;
  }
};

export const isDemoMode = !isValidSupabaseConfig(supabaseUrl, supabaseKey);

const createSupabaseClient = () => {
  if (isDemoMode) {
    if (env.DEV) {
      console.info(
        "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable live data.",
      );
    }
    return createDemoSupabaseClient();
  }

  return createClient(supabaseUrl, supabaseKey);
};

export const supabase = createSupabaseClient();
