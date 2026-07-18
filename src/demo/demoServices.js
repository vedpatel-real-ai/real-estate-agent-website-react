import { createDemoAuth } from "./demoAuth.js";
import { createDemoDatabase } from "./demoDatabase.js";
import { createDemoStorage } from "./demoStorage.js";

export function createDemoSupabaseClient() {
  return {
    auth: createDemoAuth(),
    storage: createDemoStorage(),
    ...createDemoDatabase(),
  };
}

