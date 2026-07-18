// scripts/generate-sitemap.mjs
//
// Build-time sitemap generator (Package 6.4 — Sitemap + Robots).
//
// Runs as an `npm run build` "prebuild" step (see package.json) — a
// plain Node script, not part of the Vite/React client bundle, so it
// can freely use `process.env`/`fs` and talk to Supabase directly with
// a real network round-trip at build time.
//
// Queries the live `properties` and `blog_posts` tables for every
// published (`is_published = true`) row's `slug` + `updated_at`, and
// combines them with the app's known static routes (from `App.jsx`)
// to write `public/sitemap.xml`. Vite copies everything under
// `public/` into the build output as-is, so writing here before
// `vite build` runs is sufficient to ship the generated file.
//
// Designed to degrade gracefully rather than fail the build: if
// Supabase isn't configured (e.g. a CI environment without secrets),
// it logs a warning and still writes a sitemap containing just the
// static routes, mirroring the same "fail soft" philosophy already
// used by `src/lib/supabaseClient.js`'s fallback client.

import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { loadEnv } from "vite";
import { createClient } from "@supabase/supabase-js";
import { demoBlogs, demoProperties } from "../src/demo/index.js";

const env = loadEnv(process.env.NODE_ENV ?? "production", process.cwd(), "");

const SITE_URL = (
  env.VITE_SITE_URL || "https://dreamspace-properties-demo.example"
).replace(/\/+$/, "");

// Static, always-crawlable public routes — mirrors the public route
// list in src/App.jsx. Admin/auth routes (/admin/*, /admin-secret-upload,
// /admin-register, /mppateL123) are intentionally excluded here and
// also blocked in robots.txt.
const STATIC_ROUTES = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/properties", changefreq: "daily", priority: "0.9" },
  { path: "/blog", changefreq: "daily", priority: "0.8" },
  { path: "/guaranteed-rent", changefreq: "monthly", priority: "0.7" },
  { path: "/about-us", changefreq: "monthly", priority: "0.6" },
  { path: "/contact-us", changefreq: "monthly", priority: "0.6" },
  { path: "/our-team", changefreq: "monthly", priority: "0.5" },
];

function xmlEscape(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toIsoDate(value) {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime())
    ? date.toISOString().slice(0, 10)
    : undefined;
}

function urlEntry({ path, changefreq, priority, lastmod }) {
  const loc = `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
  return [
    "  <url>",
    `    <loc>${xmlEscape(loc)}</loc>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
    changefreq ? `    <changefreq>${changefreq}</changefreq>` : null,
    priority ? `    <priority>${priority}</priority>` : null,
    "  </url>",
  ]
    .filter(Boolean)
    .join("\n");
}

async function fetchPublishedSlugs(supabase, table) {
  const { data, error } = await supabase
    .from(table)
    .select("slug, updated_at, created_at")
    .eq("is_published", true)
    .not("slug", "is", null);

  if (error) {
    console.warn(
      `[generate-sitemap] Could not fetch "${table}" (${error.message}); continuing without its entries.`,
    );
    return [];
  }
  return data ?? [];
}

async function main() {
  const entries = [...STATIC_ROUTES];

  const supabaseUrl = env.VITE_SUPABASE_URL?.trim();
  const supabaseKey = env.VITE_SUPABASE_ANON_KEY?.trim();

  if (!supabaseUrl || !supabaseKey) {
    console.warn(
      "[generate-sitemap] VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY not set — " +
        "writing a demo sitemap.xml. Set both env vars and re-run " +
        "`npm run build` to include live property/blog slugs instead.",
    );
    for (const property of demoProperties) {
      entries.push({
        path: `/properties/${property.slug}`,
        changefreq: "weekly",
        priority: "0.8",
        lastmod: toIsoDate(property.updated_at || property.created_at),
      });
    }
    for (const post of demoBlogs) {
      entries.push({
        path: `/blog/${post.slug}`,
        changefreq: "monthly",
        priority: "0.7",
        lastmod: toIsoDate(post.updated_at || post.created_at),
      });
    }
  } else {
    const supabase = createClient(supabaseUrl, supabaseKey);

    const [properties, posts] = await Promise.all([
      fetchPublishedSlugs(supabase, "properties"),
      fetchPublishedSlugs(supabase, "blog_posts"),
    ]);

    for (const property of properties) {
      entries.push({
        path: `/properties/${property.slug}`,
        changefreq: "weekly",
        priority: "0.8",
        lastmod: toIsoDate(property.updated_at || property.created_at),
      });
    }

    for (const post of posts) {
      entries.push({
        path: `/blog/${post.slug}`,
        changefreq: "monthly",
        priority: "0.7",
        lastmod: toIsoDate(post.updated_at || post.created_at),
      });
    }

    console.log(
      `[generate-sitemap] Included ${properties.length} published propert${
        properties.length === 1 ? "y" : "ies"
      } and ${posts.length} published blog post${posts.length === 1 ? "" : "s"}.`,
    );
  }

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries.map(urlEntry),
    "</urlset>",
    "",
  ].join("\n");

  const outPath = resolve(process.cwd(), "public", "sitemap.xml");
  writeFileSync(outPath, xml, "utf-8");
  console.log(`[generate-sitemap] Wrote ${entries.length} URLs to ${outPath}`);
}

main().catch((error) => {
  console.error("[generate-sitemap] Failed:", error);
  // Non-fatal: an out-of-date sitemap is far less harmful than a
  // broken production build, so this script never exits non-zero.
});
