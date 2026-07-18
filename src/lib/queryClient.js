// src/lib/queryClient.js
//
// Single shared TanStack Query client instance, created once at module
// load and imported by `main.jsx` to wrap the app in a
// `QueryClientProvider`. Centralizing it here (rather than constructing
// it inline in `main.jsx`) keeps `main.jsx` minimal and gives Package
// 3.4+ a single place to import `queryClient` from if a future package
// ever needs to imperatively invalidate/prefetch a query key from
// outside a component.
//
// Defaults are intentionally conservative and consistent with the
// `staleTime: 60_000` already set on each individual hook in
// `hooks/useProperties.js` / `useProperty.js` / `useBlogPosts.js` /
// `useBlogPost.js` — this only sets a fallback for any future query
// that doesn't specify its own.
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default queryClient;