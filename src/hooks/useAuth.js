// src/hooks/useAuth.js
//
// `useAuth` already exists as a working Supabase-Auth-backed hook in
// `context/AuthContext.jsx` (built in Package 0.3, consumed by
// AdminLogin/AdminDashboard/PropertyModule/BlogPostsModule/
// TestimonialsModule). `context/AuthContext.jsx` is locked for every
// package except 0.3 and 5.1 (Blueprint Section 14), so this package
// does not touch or duplicate that implementation.
//
// This file exists to satisfy Package 3.3's own file list (a
// `hooks/useAuth.js` entry alongside the other data hooks) while
// keeping exactly one auth implementation, re-exported here so future
// consumers can import auth alongside the other data hooks from a
// single `hooks/` location without caring which file historically
// defined it.
export { useAuth, default } from '../context/AuthContext';