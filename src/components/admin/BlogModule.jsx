// src/components/admin/BlogModule.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading2,
  Heading3,
  Heading4,
  List,
  ListOrdered,
  Quote,
  Link2,
  Link2Off,
  ImagePlus,
  Minus as HorizontalRuleIcon,
  Undo2,
  Redo2,
  Calendar,
  Clock,
  Eye,
  EyeOff,
} from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { CATEGORY_FILTER_OPTIONS } from "../blog/blogCategories";
import { getReadingTime, formatBlogDate } from "../blog/blogText";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import Badge from "../ui/Badge";
import Skeleton from "../ui/Skeleton";
import "./BlogModule.css";

/**
 * BlogModule (Package 5.3 — Blog Module + TipTap)
 *
 * Replaces `components/BlogPostsModule.jsx` — a plain `<textarea>` with
 * no rich text, no SEO fields, no publish toggle, no categories/tags
 * (redesign plan's own critical findings for this file) — with a TipTap
 * rich-text editor and the full `blog_posts` field set the rebuilt
 * public pages (Package 4.4) already expect.
 *
 * Formatting scope: the toolbar produces exactly the tag set
 * `BlogReader.jsx`'s DOMPurify `SANITIZE_CONFIG` already allows —
 * bold/italic/underline/strike, H2-H4, blockquote, bullet/ordered
 * lists, links, images, and horizontal rules — so every formatting
 * option in the editor round-trips safely through the public reader
 * with nothing silently stripped. `SANITIZE_CONFIG` also allows
 * table/figure tags (kept there for safety against manually-pasted
 * rich content), but the toolbar does not add a table-building button
 * in this package — not called for anywhere in the redesign plan's
 * blog-admin critique, and out of scope for "supports all listed
 * formatting" (the formatting the plan actually lists: bold, H2/H3
 * structure, and images in body). Flagged as a Known Deviation in
 * IMPLEMENTATION_STATE.md, not a gap in this package's own criteria.
 *
 * Field/column notes (no schema changes in this package's scope):
 *  - `title`, `content`, `image_url`, `created_at` — already in use by
 *    the pre-existing (unrebuilt) admin form and by every public blog
 *    component.
 *  - `slug`, `excerpt`, `category`, `is_published` — confirmed via
 *    `useBlogPosts.js`/`useBlogPost.js` (3.3) and `BlogCard.jsx`
 *    (4.4), which already read and filter on them.
 *  - `seo_title`, `seo_description` — confirmed via `BlogDetail.jsx`
 *    (4.4), which already renders `post.seo_title`/`post.seo_description`
 *    into `SEOHead`. Unlike 5.2's equivalent properties columns, these
 *    are independently confirmed by already-shipped, working code, not
 *    just inferred.
 *  - `reading_time_minutes` — confirmed via `blogText.js`'s
 *    `getReadingTime` (4.4), which already prefers this column over its
 *    own word-count estimate. This form auto-fills a suggested value
 *    from the content word count (reusing `getReadingTime` itself,
 *    rather than re-implementing the same word-count math) and leaves
 *    it editable, matching the Blueprint's "auto-generates and is
 *    editable" pattern already set for slug.
 *  - `tags` — a real `text[]` column per the redesign plan's schema
 *    block; passed to Supabase as a plain JS array (no JSON-stringify
 *    round-trip needed, unlike `properties.amenities`, which is a text
 *    column simulating an array).
 *
 * Slug: auto-derived from the title as the admin types (new posts
 * only), but stops auto-syncing the moment the admin edits the slug
 * field directly — the Blueprint's "auto-generates and is editable"
 * criterion, matching the same dirty-tracking pattern a title/slug
 * pair commonly needs so a deliberate edit is never silently
 * overwritten by the next keystroke in Title.
 *
 * Draft/Published: two submit actions — "Save as Draft"
 * (`is_published: false`, no title/content requirement) and "Publish"
 * (`is_published: true`, requires title + non-empty content) — mirrors
 * the two-action pattern Package 5.2 established for `PropertyModule`,
 * per this package's own "remain consistent with previously completed
 * packages" requirement, rather than inventing a different toggle
 * convention for this module.
 */

const LOCAL_STORAGE_KEY = "draft_blog_post_form_v1";
const BLOG_CATEGORY_OPTIONS = CATEGORY_FILTER_OPTIONS.filter(
  (opt) => opt.value !== "all",
);

const emptyFields = {
  title: "",
  slug: "",
  category: BLOG_CATEGORY_OPTIONS[0]?.value || "",
  excerpt: "",
  content: "",
  image_url: "",
  is_published: false,
  seo_title: "",
  seo_description: "",
  reading_time_minutes: "",
};

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* ------------------------------------------------------------------ */
/* Small in-file field primitives (no new shared ui/ files — this      */
/* package's Blueprint row lists no "Files to Create").                */
/* ------------------------------------------------------------------ */

function Field({ label, htmlFor, children, hint }) {
  return (
    <div className="bm-field">
      <label htmlFor={htmlFor}>{label}</label>
      {children}
      {hint && <p className="bm-field__hint">{hint}</p>}
    </div>
  );
}

function TagInput({ label, tags, onChange, placeholder, hint }) {
  const [draft, setDraft] = useState("");

  const commit = () => {
    const value = draft.trim();
    if (!value) return;
    if (!tags.includes(value)) onChange([...tags, value]);
    setDraft("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commit();
    } else if (e.key === "Backspace" && !draft && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const removeTag = (idx) => onChange(tags.filter((_, i) => i !== idx));

  return (
    <Field label={label} hint={hint}>
      <div className="bm-tag-input">
        {tags.map((tag, idx) => (
          <span key={`${tag}-${idx}`} className="bm-tag">
            {tag}
            <button
              type="button"
              aria-label={`Remove ${tag}`}
              onClick={() => removeTag(idx)}
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={commit}
          placeholder={placeholder}
        />
      </div>
    </Field>
  );
}

/* ------------------------------------------------------------------ */
/* Rich-text editor (TipTap)                                            */
/* ------------------------------------------------------------------ */

function ToolbarButton({ onClick, active, disabled, label, children }) {
  return (
    <button
      type="button"
      className={`bm-toolbar__btn ${active ? "bm-toolbar__btn--active" : ""}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  );
}

function EditorToolbar({ editor }) {
  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Link URL", previousUrl || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url, target: "_blank" }).run();
  };

  const addImage = () => {
    const url = window.prompt("Image URL");
    if (!url) return;
    editor.chain().focus().setImage({ src: url }).run();
  };

  return (
    <div className="bm-toolbar" role="toolbar" aria-label="Formatting">
      <ToolbarButton
        label="Bold"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <BoldIcon size={16} />
      </ToolbarButton>
      <ToolbarButton
        label="Italic"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <ItalicIcon size={16} />
      </ToolbarButton>
      <ToolbarButton
        label="Underline"
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon size={16} />
      </ToolbarButton>
      <ToolbarButton
        label="Strikethrough"
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough size={16} />
      </ToolbarButton>

      <span className="bm-toolbar__divider" aria-hidden="true" />

      <ToolbarButton
        label="Heading 2"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 size={16} />
      </ToolbarButton>
      <ToolbarButton
        label="Heading 3"
        active={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 size={16} />
      </ToolbarButton>
      <ToolbarButton
        label="Heading 4"
        active={editor.isActive("heading", { level: 4 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
      >
        <Heading4 size={16} />
      </ToolbarButton>

      <span className="bm-toolbar__divider" aria-hidden="true" />

      <ToolbarButton
        label="Bullet list"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List size={16} />
      </ToolbarButton>
      <ToolbarButton
        label="Ordered list"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered size={16} />
      </ToolbarButton>
      <ToolbarButton
        label="Blockquote"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote size={16} />
      </ToolbarButton>

      <span className="bm-toolbar__divider" aria-hidden="true" />

      <ToolbarButton
        label={editor.isActive("link") ? "Remove link" : "Add link"}
        active={editor.isActive("link")}
        onClick={setLink}
      >
        {editor.isActive("link") ? <Link2Off size={16} /> : <Link2 size={16} />}
      </ToolbarButton>
      <ToolbarButton label="Insert image" onClick={addImage}>
        <ImagePlus size={16} />
      </ToolbarButton>
      <ToolbarButton
        label="Horizontal rule"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <HorizontalRuleIcon size={16} />
      </ToolbarButton>

      <span className="bm-toolbar__divider" aria-hidden="true" />

      <ToolbarButton
        label="Undo"
        disabled={!editor.can().undo()}
        onClick={() => editor.chain().focus().undo().run()}
      >
        <Undo2 size={16} />
      </ToolbarButton>
      <ToolbarButton
        label="Redo"
        disabled={!editor.can().redo()}
        onClick={() => editor.chain().focus().redo().run()}
      >
        <Redo2 size={16} />
      </ToolbarButton>
    </div>
  );
}

function RichTextEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        code: false,
        codeBlock: false,
        heading: { levels: [2, 3, 4] },
        link: {
          openOnClick: false,
          autolink: true,
          HTMLAttributes: { rel: "noopener noreferrer" },
        },
      }),
      ImageExtension.configure({ HTMLAttributes: { loading: "lazy" } }),
      Placeholder.configure({
        placeholder: "Write the post content here…",
      }),
    ],
    content: value || "",
    onUpdate: ({ editor: e }) => onChange(e.getHTML()),
  });

  // Keep the editor's document in sync when switching between the Add
  // form and an Edit modal instance (a fresh `key` on <BlogForm> already
  // remounts this component per-post, but this guards against the same
  // editor instance ever being reused across two different posts'
  // `value` without a remount).
  const lastSyncedValue = useRef(value);
  useEffect(() => {
    if (!editor) return;
    if (value !== lastSyncedValue.current && value !== editor.getHTML()) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
    lastSyncedValue.current = value;
  }, [value, editor]);

  return (
    <div className="bm-editor">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} className="bm-editor__content" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Shared form — used for both Add and Edit                            */
/* ------------------------------------------------------------------ */

function BlogForm({ post, onSave, onCancel, saving, isCreate }) {
  const buildFieldsFromPost = (p) => {
    const base = { ...emptyFields };
    if (p) {
      Object.keys(base).forEach((key) => {
        if (p[key] !== undefined && p[key] !== null) base[key] = p[key];
      });
      base.is_published = Boolean(p.is_published);
      base.reading_time_minutes = p.reading_time_minutes ?? "";
    }
    return base;
  };

  const [fields, setFields] = useState(() => {
    if (isCreate) {
      const saved = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        try {
          return { ...emptyFields, ...JSON.parse(saved) };
        } catch {
          // ignore corrupt draft
        }
      }
    }
    return buildFieldsFromPost(post);
  });
  const [tags, setTags] = useState(() =>
    Array.isArray(post?.tags) ? post.tags : [],
  );
  const [slugDirty, setSlugDirty] = useState(Boolean(post?.slug));
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(post?.image_url || "");
  const objectUrlRef = useRef(null);

  useEffect(() => {
    if (isCreate) {
      window.localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({ ...fields, tags }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields, tags, isCreate]);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  const handleField = (key) => (e) => {
    const { type, value, checked } = e.target;
    setFields((prev) => ({
      ...prev,
      [key]: type === "checkbox" ? checked : value,
    }));
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFields((prev) => ({
      ...prev,
      title,
      slug: slugDirty ? prev.slug : slugify(title),
    }));
  };

  const handleSlugChange = (e) => {
    setSlugDirty(true);
    setFields((prev) => ({ ...prev, slug: e.target.value }));
  };

  const handleContentChange = (html) => {
    setFields((prev) => ({ ...prev, content: html }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    setImagePreview(url);
  };

  const suggestedReadingTime = useMemo(
    () => getReadingTime({ content: fields.content }),
    [fields.content],
  );

  const buildPayload = (publishState) => ({
    ...fields,
    slug: fields.slug || slugify(fields.title),
    is_published: publishState,
    tags,
    reading_time_minutes:
      fields.reading_time_minutes === ""
        ? suggestedReadingTime
        : Number(fields.reading_time_minutes),
  });

  const submit = async (e, { asDraft } = {}) => {
    e.preventDefault();
    if (!asDraft) {
      if (!fields.title.trim()) {
        alert("Please enter a title before publishing.");
        return;
      }
      if (!fields.content || fields.content === "<p></p>") {
        alert("Please add some content before publishing.");
        return;
      }
    }
    const publishState = asDraft ? false : true;
    const payload = buildPayload(publishState);
    const ok = await onSave(payload, imageFile);
    if (ok && isCreate) {
      window.localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  };

  return (
    <form
      onSubmit={(e) => submit(e, { asDraft: false })}
      className="bm-form"
      noValidate
    >
      <div className="bm-grid">
        <Field label="Title" htmlFor="f-title">
          <input
            id="f-title"
            type="text"
            value={fields.title}
            onChange={handleTitleChange}
          />
        </Field>
        <Field
          label="Slug"
          htmlFor="f-slug"
          hint="Auto-generated from the title; edit to override."
        >
          <input
            id="f-slug"
            type="text"
            value={fields.slug}
            onChange={handleSlugChange}
          />
        </Field>
        <Field label="Category" htmlFor="f-category">
          <select
            id="f-category"
            value={fields.category}
            onChange={handleField("category")}
          >
            {BLOG_CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Status" htmlFor="f-is_published">
          <label className="bm-toggle">
            <input
              id="f-is_published"
              type="checkbox"
              checked={fields.is_published}
              onChange={handleField("is_published")}
            />
            {fields.is_published ? (
              <>
                <Eye size={14} /> Published
              </>
            ) : (
              <>
                <EyeOff size={14} /> Draft
              </>
            )}
          </label>
        </Field>
      </div>

      <Field
        label="Excerpt"
        htmlFor="f-excerpt"
        hint="Shown on blog cards. Falls back to a trimmed content snippet if left blank."
      >
        <textarea
          id="f-excerpt"
          rows={2}
          value={fields.excerpt}
          onChange={handleField("excerpt")}
        />
      </Field>

      <Field label="Cover Image">
        <div className="bm-image-picker">
          {imagePreview && (
            <img
              src={imagePreview}
              alt=""
              className="bm-image-picker__preview"
              loading="lazy"
            />
          )}
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
      </Field>

      <Field label="Content" htmlFor="f-content">
        <RichTextEditor value={fields.content} onChange={handleContentChange} />
      </Field>

      <TagInput
        label="Tags"
        tags={tags}
        onChange={setTags}
        placeholder="Type a tag and press Enter…"
        hint="Press Enter or comma to add a tag."
      />

      <div className="bm-grid">
        <Field
          label="Reading Time (minutes)"
          htmlFor="f-reading_time"
          hint={
            suggestedReadingTime
              ? `Suggested from content: ${suggestedReadingTime} min. Leave blank to use it.`
              : "Leave blank to estimate automatically from content."
          }
        >
          <input
            id="f-reading_time"
            type="number"
            min="1"
            value={fields.reading_time_minutes}
            onChange={handleField("reading_time_minutes")}
          />
        </Field>
      </div>

      <fieldset className="bm-seo">
        <legend>SEO</legend>
        <Field label="SEO Title" htmlFor="f-seo_title">
          <input
            id="f-seo_title"
            type="text"
            value={fields.seo_title}
            onChange={handleField("seo_title")}
          />
        </Field>
        <Field label="SEO Description" htmlFor="f-seo_description">
          <textarea
            id="f-seo_description"
            rows={2}
            value={fields.seo_description}
            onChange={handleField("seo_description")}
          />
        </Field>
      </fieldset>

      <div className="bm-form__actions">
        {isCreate ? (
          <>
            <Button
              type="button"
              variant="outline"
              disabled={saving}
              onClick={(e) => submit(e, { asDraft: true })}
            >
              {saving ? "Saving…" : "Save as Draft"}
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={saving}
              loading={saving}
            >
              Publish Post
            </Button>
          </>
        ) : (
          <>
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={saving}
              onClick={(e) => submit(e, { asDraft: true })}
            >
              Save as Draft
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={saving}
              loading={saving}
            >
              Save &amp; Publish
            </Button>
          </>
        )}
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Main module                                                         */
/* ------------------------------------------------------------------ */

const BLOG_LIST_SKELETON_COUNT = 6;

function BlogListSkeleton() {
  return (
    <div className="bm-list">
      {Array.from({ length: BLOG_LIST_SKELETON_COUNT }).map((_, i) => (
        <div className="bm-card" key={i}>
          <Skeleton variant="rect" height={150} className="bm-card__image" />
          <div className="bm-card__details">
            <Skeleton variant="text" width="70%" height={18} />
            <Skeleton variant="text" width="50%" />
            <Skeleton variant="text" width="40%" />
          </div>
        </div>
      ))}
    </div>
  );
}

const BlogModule = () => {
  const [posts, setPosts] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      window.location.href = "/mppateL123";
      return;
    }
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isAuthenticated]);

  const fetchPosts = async () => {
    setLoadingList(true);
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) console.error("Error fetching blog posts:", error);
    else setPosts(data ?? []);
    setLoadingList(false);
  };

  const uploadImage = async (imageFile) => {
    const ext = imageFile.name.split(".").pop();
    const path = `blog/${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("blog-images")
      .upload(path, imageFile);
    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from("blog-images").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleCreate = async (payload, imageFile) => {
    setSaving(true);
    try {
      let image_url = payload.image_url || "";
      if (imageFile) image_url = await uploadImage(imageFile);
      const { error } = await supabase
        .from("blog_posts")
        .insert([{ ...payload, image_url }]);
      if (error) throw error;
      await fetchPosts();
      return true;
    } catch (err) {
      alert("Error saving post: " + err.message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (id, payload, imageFile) => {
    setSaving(true);
    try {
      let image_url = payload.image_url || "";
      if (imageFile) image_url = await uploadImage(imageFile);
      const { error } = await supabase
        .from("blog_posts")
        .update({ ...payload, image_url, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
      await fetchPosts();
      setEditingId(null);
      return true;
    } catch (err) {
      alert("Error updating post: " + err.message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const deletePost = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) alert("Error deleting post: " + error.message);
    else setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const editingPost = useMemo(
    () => posts.find((p) => p.id === editingId) || null,
    [posts, editingId],
  );

  return (
    <div className="bm-module">
      <section className="bm-section">
        <h2>📝 Add New Post</h2>
        <BlogForm key="create" post={null} isCreate saving={saving} onSave={handleCreate} />
      </section>

      <section className="bm-section">
        <h2>📚 Blog Posts ({posts.length})</h2>
        {loadingList ? (
          <BlogListSkeleton />
        ) : posts.length === 0 ? (
          <p>No blog posts found.</p>
        ) : (
          <div className="bm-list">
            {posts.map((post) => (
              <div key={post.id} className="bm-card">
                {post.image_url && (
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="bm-card__image"
                    loading="lazy"
                  />
                )}
                <div className="bm-card__details">
                  <div className="bm-card__badges">
                    {!post.is_published && (
                      <Badge variant="warning" size="small">
                        <EyeOff size={12} /> Draft
                      </Badge>
                    )}
                    {post.category && (
                      <Badge variant="neutral" size="small">
                        {BLOG_CATEGORY_OPTIONS.find(
                          (opt) => opt.value === post.category,
                        )?.label || post.category}
                      </Badge>
                    )}
                  </div>
                  <h3>{post.title || "Untitled post"}</h3>
                  <p className="bm-card__meta">
                    <Calendar size={13} className="icon" />{" "}
                    {formatBlogDate(post.created_at) || "—"}
                    {post.reading_time_minutes ? (
                      <>
                        {" "}
                        <Clock size={13} className="icon" />{" "}
                        {post.reading_time_minutes} min read
                      </>
                    ) : null}
                  </p>
                </div>
                <div className="bm-card__actions">
                  <Button
                    size="small"
                    variant="outline"
                    onClick={() => setEditingId(post.id)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    variant="danger"
                    onClick={() => deletePost(post.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Modal
        isOpen={editingId !== null}
        onClose={() => setEditingId(null)}
        title="Edit Post"
        size="large"
      >
        {editingPost && (
          <BlogForm
            key={editingPost.id}
            post={editingPost}
            isCreate={false}
            saving={saving}
            onCancel={() => setEditingId(null)}
            onSave={(payload, imageFile) =>
              handleUpdate(editingPost.id, payload, imageFile)
            }
          />
        )}
      </Modal>
    </div>
  );
};

export default BlogModule;