import { placeholderImage } from "./placeholders.js";

export function createDemoStorage() {
  return {
    from: (bucket) => ({
      upload: async (path) => ({
        data: { path, fullPath: `${bucket}/${path}` },
        error: null,
      }),
      getPublicUrl: (path) => ({
        data: {
          publicUrl: placeholderImage(`${bucket} Image`, 1200, 800),
        },
        error: null,
      }),
    }),
  };
}

