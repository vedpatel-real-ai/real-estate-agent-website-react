import { createClient } from "@supabase/supabase-js";

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

const createFallbackClient = () => {
  const buildError = () => ({
    data: null,
    error: new Error("Supabase is not configured."),
  });

  const queryBuilder = {
    select: () => queryBuilder,
    insert: async () => buildError(),
    update: () => queryBuilder,
    delete: () => queryBuilder,
    eq: () => queryBuilder,
    in: () => queryBuilder,
    order: () => queryBuilder,
    limit: () => queryBuilder,
    range: () => queryBuilder,
    single: async () => buildError(),
    maybeSingle: async () => buildError(),
    then: (resolve) => Promise.resolve({ data: [], error: null }).then(resolve),
    catch: (onRejected) =>
      Promise.resolve({ data: [], error: null }).catch(onRejected),
    finally: (onFinally) =>
      Promise.resolve({ data: [], error: null }).finally(onFinally),
  };

  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe() {} } },
      }),
      signInWithPassword: async () => ({
        data: { session: null },
        error: new Error("Supabase is not configured."),
      }),
      signOut: async () => ({
        error: new Error("Supabase is not configured."),
      }),
    },
    from: () => queryBuilder,
    storage: {
      from: () => ({
        upload: async () => buildError(),
        getPublicUrl: () => ({ data: { publicUrl: "" }, error: null }),
      }),
    },
  };
};

const createSupabaseClient = () => {
  if (isDemoMode) {
    if (env.DEV) {
      console.info(
        "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable live data.",
      );
    }
    return createFallbackClient();
  }

  return createClient(supabaseUrl, supabaseKey);
};

export const supabase = createSupabaseClient();
