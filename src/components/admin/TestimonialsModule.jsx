// src/components/admin/TestimonialsModule.jsx
import React, { useEffect, useRef, useState } from "react";
import { Plus, Pencil, Trash2, ImagePlus, Quote } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
import StarRating from "../ui/StarRating";
import Card from "../ui/Card";
import Skeleton from "../ui/Skeleton";
import "./TestimonialsModule.css";

/**
 * TestimonialsModule (Package 5.5 — Testimonials Module + Settings)
 *
 * Relocated + rebuilt from `components/TestimonialsModule.jsx` per the
 * Blueprint's row 5.5 file-move spec. The redesign plan's own critique of
 * the pre-rebuild component (Part A/Section 6 feature inventory: "Fully
 * functional but uses inline style objects throughout. Stars field is a
 * number input — not a star picker. No reorder / drag-to-sort.") already
 * marks the underlying CRUD as "Keep" — this package modernizes the UI
 * onto the shared `ui/` primitives and the numeric stars input into the
 * shared `StarRating` picker; it does not add reorder/drag-to-sort, since
 * that would need a `sort_order` column that does not exist on the
 * `testimonials` table today and adding one is a schema change outside
 * this package's scope (Database Rules: "do not invent schema changes").
 *
 * Field/column notes (no schema changes in this package's scope):
 *  - `name`, `role`, `feedback`, `stars`, `image_url`, `created_at` — the
 *    exact column set already read by the pre-existing component and by
 *    `components/shared/TestimonialCarousel.jsx` (Package 4.1), which is
 *    the live public consumer of this table. No new columns are
 *    introduced; nothing here can break that consumer.
 *  - No `is_visible`/`sort_order` columns exist on `testimonials` today
 *    (unlike the redesign plan's separate, not-yet-built `team_members`
 *    table, which does define both) — a draft/publish toggle or manual
 *    ordering control is therefore not implemented here. Flagged as a
 *    Known Deviation in IMPLEMENTATION_STATE.md.
 *
 * Image upload: reuses the pre-existing `testimonial-photos` storage
 * bucket (already referenced by the unrebuilt component, so presumed to
 * already exist) via the same upload-then-`getPublicUrl` pattern
 * `PropertyModule`/`BlogModule` (5.2/5.3) already established, rather
 * than inventing a different storage flow for this module.
 *
 * Delete confirmation uses `window.confirm`, matching the exact pattern
 * every other rebuilt admin module (Property/Blog/Leads) already uses,
 * per this package's "remain consistent with previously completed
 * packages" requirement.
 */

const ADMIN_LOGIN_PATH = "/mppateL123";
const STORAGE_BUCKET = "testimonial-photos";

const emptyForm = { name: "", role: "", feedback: "", stars: 5 };

function buildStoragePath(file) {
  const ext = file.name.split(".").pop();
  return `testimonial_${Date.now()}.${ext}`;
}

async function uploadTestimonialImage(file) {
  const path = buildStoragePath(file);
  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file);
  if (error) throw error;
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

const TESTIMONIALS_SKELETON_COUNT = 6;

function TestimonialsGridSkeleton() {
  return (
    <div className="tm-grid">
      {Array.from({ length: TESTIMONIALS_SKELETON_COUNT }).map((_, i) => (
        <Card className="tm-card" key={i}>
          <div className="tm-card__top">
            <Skeleton variant="circle" width={56} height={56} className="tm-card__avatar" />
            <div>
              <Skeleton variant="text" width={100} />
              <Skeleton variant="text" width={70} />
            </div>
          </div>
          <Skeleton variant="text" width={90} className="tm-card__stars" />
          <Skeleton variant="text" lines={3} />
        </Card>
      ))}
    </div>
  );
}

const TestimonialsModule = () => {
  const { isAuthenticated, isLoading } = useAuth();

  const [testimonials, setTestimonials] = useState([]);
  const [loadingList, setLoadingList] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null); // null = add mode
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const fileInputRef = useRef(null);

  const fetchTestimonials = async () => {
    setLoadingList(true);
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Error fetching testimonials:", error.message);
      setTestimonials([]);
    } else {
      setTestimonials(data ?? []);
    }
    setLoadingList(false);
  };

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      window.location.href = ADMIN_LOGIN_PATH;
      return;
    }
    fetchTestimonials();
  }, [isLoading, isAuthenticated]);

  const openAddModal = () => {
    setEditingTestimonial(null);
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview("");
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (testimonial) => {
    setEditingTestimonial(testimonial);
    setForm({
      name: testimonial.name || "",
      role: testimonial.role || "",
      feedback: testimonial.feedback || "",
      stars: testimonial.stars || 5,
    });
    setImageFile(null);
    setImagePreview(testimonial.image_url || "");
    setFormError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setIsModalOpen(false);
  };

  const handleFieldChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleStarsChange = (value) => {
    setForm((prev) => ({ ...prev, stars: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!form.name.trim() || !form.role.trim() || !form.feedback.trim()) {
      setFormError("Name, role, and feedback are all required.");
      return;
    }

    setSaving(true);
    try {
      let image_url = editingTestimonial?.image_url || "";
      if (imageFile) {
        image_url = await uploadTestimonialImage(imageFile);
      }

      const payload = {
        name: form.name.trim(),
        role: form.role.trim(),
        feedback: form.feedback.trim(),
        stars: Number(form.stars) || 5,
        image_url,
      };

      if (editingTestimonial) {
        const { error } = await supabase
          .from("testimonials")
          .update(payload)
          .eq("id", editingTestimonial.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("testimonials").insert([payload]);
        if (error) throw error;
      }

      setIsModalOpen(false);
      fetchTestimonials();
    } catch (err) {
      setFormError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) {
      return;
    }
    setDeletingId(id);
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) {
      alert("Error deleting testimonial: " + error.message);
    } else {
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
    }
    setDeletingId(null);
  };

  return (
    <div className="tm-module">
      <section className="tm-section">
        <div className="tm-header">
          <h2>
            <Quote size={22} aria-hidden="true" /> Testimonials
          </h2>
          <Button variant="primary" size="small" onClick={openAddModal}>
            <Plus size={16} /> Add Testimonial
          </Button>
        </div>

        {loadingList ? (
          <TestimonialsGridSkeleton />
        ) : testimonials.length === 0 ? (
          <p>No testimonials yet. Add your first one to show it on the homepage.</p>
        ) : (
          <div className="tm-grid">
            {testimonials.map((t) => (
              <Card key={t.id} className="tm-card" hoverable>
                <div className="tm-card__top">
                  {t.image_url ? (
                    <img
                      src={t.image_url}
                      alt={t.name}
                      className="tm-card__avatar"
                      loading="lazy"
                      width={56}
                      height={56}
                    />
                  ) : (
                    <div className="tm-card__avatar tm-card__avatar--placeholder">
                      {(t.name || "?").charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h4 className="tm-card__name">{t.name}</h4>
                    <p className="tm-card__role">{t.role}</p>
                  </div>
                </div>

                <StarRating rating={t.stars || 0} size={16} className="tm-card__stars" />

                <p className="tm-card__feedback">{t.feedback}</p>

                <div className="tm-card__actions">
                  <Button size="small" variant="outline" onClick={() => openEditModal(t)}>
                    <Pencil size={14} /> Edit
                  </Button>
                  <Button
                    size="small"
                    variant="danger"
                    disabled={deletingId === t.id}
                    loading={deletingId === t.id}
                    onClick={() => handleDelete(t.id)}
                  >
                    <Trash2 size={14} /> Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingTestimonial ? "Edit Testimonial" : "Add Testimonial"}
        size="medium"
        footer={
          <>
            <Button variant="ghost" onClick={closeModal} disabled={saving}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              loading={saving}
              disabled={saving}
            >
              {editingTestimonial ? "Save Changes" : "Add Testimonial"}
            </Button>
          </>
        }
      >
        <form className="tm-form" onSubmit={handleSubmit}>
          <Input
            label="Name"
            name="name"
            value={form.name}
            onChange={handleFieldChange("name")}
            placeholder="Client name"
            required
          />
          <Input
            label="Role / Title"
            name="role"
            value={form.role}
            onChange={handleFieldChange("role")}
            placeholder="e.g. Homeowner, Investor"
            required
          />
          <Textarea
            label="Feedback"
            name="feedback"
            value={form.feedback}
            onChange={handleFieldChange("feedback")}
            placeholder="What did they say about DreamSpace Properties?"
            rows={4}
            required
          />

          <div className="tm-form__field">
            <span className="ui-field__label">Rating</span>
            <StarRating
              rating={form.stars}
              readOnly={false}
              onChange={handleStarsChange}
              size={24}
            />
          </div>

          <div className="tm-form__field">
            <span className="ui-field__label">Photo</span>
            <div className="tm-form__image-row">
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="tm-form__image-preview"
                  width={56}
                  height={56}
                />
              )}
              <Button
                type="button"
                variant="outline"
                size="small"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImagePlus size={14} /> {imagePreview ? "Change Photo" : "Upload Photo"}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="tm-form__file-input"
              />
            </div>
          </div>

          {formError && (
            <p className="tm-form__error" role="alert">
              {formError}
            </p>
          )}
        </form>
      </Modal>
    </div>
  );
};

export default TestimonialsModule;
