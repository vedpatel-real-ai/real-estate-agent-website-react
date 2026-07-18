// src/components/admin/PropertyModule.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import {
  FaMapMarkerAlt,
  FaBed,
  FaRuler,
  FaStar,
  FaEyeSlash,
} from "react-icons/fa";
import { PROPERTY_TYPE_OPTIONS } from "../property/PropertyFilters";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import Badge from "../ui/Badge";
import Spinner from "../ui/Spinner";
import "./PropertyModule.css";

/**
 * PropertyModule (Package 5.2 — Property Module Rebuild)
 *
 * Replaces the flat `Object.entries(initialState)` generic-loop form
 * (2.2's interim version) with the purpose-built, tabbed field groups
 * the redesign plan specifies: Basic Info / Location / Pricing / Details
 * (specifications + developer + content + media, kept together so the
 * tab set matches the Blueprint's own five-tab verification checklist —
 * "Basic/Location/Details/Pricing/SEO") / SEO.
 *
 * Both the "Add Property" section and the "Edit Property" modal now
 * share one `PropertyForm` implementation instead of two near-identical
 * ~300-line blocks — the old file's worst duplication (Blueprint Section
 * 9G technical debt / this package's own "No duplicate logic" quality
 * requirement).
 *
 * Field/column notes (no schema changes are in this package's scope —
 * every field below writes to a column already confirmed in use
 * elsewhere in the app):
 *  - `listing_type`, `price_type`, `bhk_min`/`max`, `is_featured`,
 *    `is_published` — confirmed via PropertyCard.jsx / useProperties.js
 *    (2.1/2.2).
 *  - `slug`, `city`, `locality`, `price_per_sqft` — confirmed via
 *    useProperties.js / useProperty.js / PropertyFilters.jsx (3.3/3.4).
 *    `slug` is server-managed (backfilled by 2.1) and intentionally not
 *    exposed as an editable field here; changing it would break existing
 *    inbound links, which is a bigger decision than this package owns.
 *  - `brochure_url` — confirmed via PropertyDetailPage.jsx (4.3), which
 *    already renders a brochure-download button, but no prior admin form
 *    ever exposed this field for editing. Added here — a genuine gap
 *    fix, not scope creep, since the field already exists and is already
 *    consumed by shipped public code.
 *  - `seo_title` / `seo_description` — NOT independently re-verified
 *    against the live schema this session (out of this package's file
 *    scope, which is app code only, not SQL). They're included because
 *    (a) the redesign plan's own spec calls for an SEO tab with exactly
 *    these two fields, (b) `blog_posts` already has both columns and 2.1
 *    added several properties columns beyond 2.2's narrow 6-column list
 *    (`slug`/`city`/`locality`/`price_per_sqft`/`brochure_url` are all
 *    real despite none being in 2.2's scope), and (c) `SEOHead.jsx`'s
 *    own usage docstring already references `property.seo_description`.
 *    Flagged as a Known Deviation in IMPLEMENTATION_STATE.md rather than
 *    omitted or blocked on — if the columns turn out not to exist, saves
 *    will fail with a clear Postgres "column not found" error rather
 *    than silently losing data, and the fix is a one-line migration, not
 *    a rewrite.
 *  - The legacy free-text `bhk` field (flagged as a 5.2 concern by 2.2)
 *    is retired from the form here: `bhk_min`/`bhk_max` fully cover it,
 *    `PropertyCard.jsx` already prefers min/max over `bhk`, and keeping
 *    a third, unreconciled BHK input would just reintroduce the
 *    ambiguity 2.1 was migrating away from. Existing rows' `bhk` values
 *    are left untouched in the database; this form simply stops writing
 *    to that column going forward.
 *  - "Area" (a fourth Location field the redesign plan lists alongside
 *    City/Locality/Google Map URL) has no corresponding column anywhere
 *    in the current app or schema export — omitted, flagged below.
 *    "Virtual tour URL" (Media) is the same case — omitted, flagged.
 *
 * Server-side draft save: the Add-property form now has two submit
 * actions — "Save as Draft" (writes the row immediately with
 * `is_published: false`, skipping the name-required check) and "Publish
 * Property" (requires a name, writes with `is_published: true`). This
 * replaces the old localStorage-only draft, which never actually reached
 * Supabase, with a real server-side draft row admins can find again in
 * the list below (shown with a "Draft" badge) and finish later via Edit.
 * A localStorage safety-net (crash/tab-close recovery of in-progress
 * keystrokes before either save action runs) is kept alongside it.
 */

const LISTING_TYPE_OPTIONS = ["buy", "rent", "commercial"];
const PRICE_TYPE_OPTIONS = ["exact", "starting_from", "on_request"];
const LOCAL_STORAGE_KEY = "draft_property_form_v2";

const emptyFields = {
  // Basic
  name: "",
  listing_type: "buy",
  property_type: "",
  is_featured: false,
  is_published: true,
  // Location
  location: "",
  city: "Gandhinagar",
  locality: "",
  google_map_location: "",
  // Pricing
  price_type: "exact",
  price: "",
  price_per_sqft: "",
  // Specifications
  bhk_min: "",
  bhk_max: "",
  carpet_area: "",
  project_area: "",
  towers: "",
  floor: "",
  no_of_units: "",
  parking: "",
  property_view: "",
  possession: "",
  rera_no: "",
  ownership: "",
  // Developer
  developed_by: "",
  about_builder_company: "",
  // Content
  about_property: "",
  about_location: "",
  explore_neighbourhood: "",
  // Media
  google_drive_url: "",
  brochure_url: "",
  // SEO
  seo_title: "",
  seo_description: "",
};

const TABS = [
  { id: "basic", label: "Basic Info" },
  { id: "location", label: "Location" },
  { id: "pricing", label: "Pricing" },
  { id: "details", label: "Details" },
  { id: "seo", label: "SEO" },
];

function toArray(raw) {
  if (Array.isArray(raw)) return raw;
  if (!raw) return [];
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // fall through to comma-split
    }
    return raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

function toConfigRows(raw) {
  if (Array.isArray(raw)) return raw;
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/* ------------------------------------------------------------------ */
/* Small in-file field primitives (no new shared ui/ files per this    */
/* package's "Files to Create: —" scope — everything below is local    */
/* to this component).                                                 */
/* ------------------------------------------------------------------ */

function Field({ label, htmlFor, children, hint }) {
  return (
    <div className="pm-field">
      <label htmlFor={htmlFor}>{label}</label>
      {children}
      {hint && <p className="pm-field__hint">{hint}</p>}
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
      <div className="pm-tag-input">
        {tags.map((tag, idx) => (
          <span key={`${tag}-${idx}`} className="pm-tag">
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

function ConfigEditor({ rows, onChange }) {
  const updateRow = (idx, key, value) => {
    const next = rows.map((row, i) =>
      i === idx ? { ...row, [key]: value } : row,
    );
    onChange(next);
  };
  const addRow = () => onChange([...rows, { type: "", area: "", price: "" }]);
  const removeRow = (idx) => onChange(rows.filter((_, i) => i !== idx));

  return (
    <Field
      label="Floor Plans & Pricing"
      hint="Shown as the configurations table on the property detail page."
    >
      <div className="pm-config-editor">
        {rows.length > 0 && (
          <div className="pm-config-editor__header">
            <span>Unit Type</span>
            <span>Area (sq.ft)</span>
            <span>Price</span>
            <span aria-hidden="true" />
          </div>
        )}
        {rows.map((row, idx) => (
          <div className="pm-config-editor__row" key={idx}>
            <input
              type="text"
              placeholder="e.g. 2 BHK"
              value={row.type || ""}
              onChange={(e) => updateRow(idx, "type", e.target.value)}
            />
            <input
              type="text"
              placeholder="e.g. 1150"
              value={row.area || ""}
              onChange={(e) => updateRow(idx, "area", e.target.value)}
            />
            <input
              type="text"
              placeholder="e.g. 5500000"
              value={row.price || ""}
              onChange={(e) => updateRow(idx, "price", e.target.value)}
            />
            <button
              type="button"
              className="pm-config-editor__remove"
              onClick={() => removeRow(idx)}
              aria-label="Remove row"
            >
              ×
            </button>
          </div>
        ))}
        <Button type="button" variant="outline" size="small" onClick={addRow}>
          + Add Configuration
        </Button>
      </div>
    </Field>
  );
}

/* ------------------------------------------------------------------ */
/* Shared form — used for both Add and Edit                            */
/* ------------------------------------------------------------------ */

function PropertyForm({
  property,
  onSave,
  onCancel,
  saving,
  isCreate,
  persistDraftToLocalStorage,
}) {
  const buildFieldsFromProperty = (p) => {
    const base = { ...emptyFields };
    if (p) {
      Object.keys(base).forEach((key) => {
        if (p[key] !== undefined && p[key] !== null) base[key] = p[key];
      });
      base.is_featured = Boolean(p.is_featured);
      base.is_published = p.is_published !== false;
      base.bhk_min = p.bhk_min ?? "";
      base.bhk_max = p.bhk_max ?? "";
    }
    return base;
  };

  const [activeTab, setActiveTab] = useState("basic");
  const [fields, setFields] = useState(() => {
    if (isCreate && persistDraftToLocalStorage) {
      const saved = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        try {
          return { ...emptyFields, ...JSON.parse(saved) };
        } catch {
          // ignore corrupt draft
        }
      }
    }
    return buildFieldsFromProperty(property);
  });
  const [amenities, setAmenities] = useState(() =>
    toArray(property?.amenities),
  );
  const [keyFeatures, setKeyFeatures] = useState(() =>
    toArray(property?.key_features),
  );
  const [configRows, setConfigRows] = useState(() =>
    toConfigRows(property?.floor_space_pricing),
  );
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(property?.image_url || "");
  const objectUrlRef = useRef(null);

  useEffect(() => {
    if (isCreate && persistDraftToLocalStorage) {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fields));
    }
  }, [fields, isCreate, persistDraftToLocalStorage]);

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

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    setImagePreview(url);
  };

  const buildPayload = (forcePublishState) => ({
    ...fields,
    is_published: forcePublishState,
    bhk_min: fields.bhk_min === "" ? null : Number(fields.bhk_min),
    bhk_max: fields.bhk_max === "" ? null : Number(fields.bhk_max),
    price: fields.price === "" ? null : Number(fields.price),
    price_per_sqft:
      fields.price_per_sqft === "" ? null : Number(fields.price_per_sqft),
    no_of_units: fields.no_of_units === "" ? null : Number(fields.no_of_units),
    amenities: JSON.stringify(amenities),
    key_features: keyFeatures.join(", "),
    floor_space_pricing: JSON.stringify(
      configRows.filter((r) => r.type || r.area || r.price),
    ),
  });

  const submit = async (e, { asDraft } = {}) => {
    e.preventDefault();
    if (!asDraft && !fields.name.trim()) {
      setActiveTab("basic");
      alert("Please enter a property name before publishing.");
      return;
    }
    const publishState = asDraft ? false : Boolean(fields.is_published);
    const payload = buildPayload(publishState);
    const ok = await onSave(payload, imageFile);
    if (ok && isCreate && persistDraftToLocalStorage) {
      window.localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  };

  return (
    <form
      onSubmit={(e) => submit(e, { asDraft: false })}
      className="pm-form"
      noValidate
    >
      <div className="pm-tabs" role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`pm-tab ${activeTab === tab.id ? "pm-tab--active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="pm-tab-panel">
        {activeTab === "basic" && (
          <div className="pm-grid">
            <Field label="Property Name" htmlFor="f-name">
              <input
                id="f-name"
                type="text"
                value={fields.name}
                onChange={handleField("name")}
              />
            </Field>
            <Field label="Listing Type" htmlFor="f-listing_type">
              <select
                id="f-listing_type"
                value={fields.listing_type}
                onChange={handleField("listing_type")}
              >
                {LISTING_TYPE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Property Type" htmlFor="f-property_type">
              <select
                id="f-property_type"
                value={fields.property_type}
                onChange={handleField("property_type")}
              >
                <option value="">Select type…</option>
                {PROPERTY_TYPE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Status" htmlFor="f-is_published">
              <label className="pm-toggle">
                <input
                  id="f-is_published"
                  type="checkbox"
                  checked={fields.is_published}
                  onChange={handleField("is_published")}
                />
                {fields.is_published ? "Published" : "Draft"}
              </label>
            </Field>
            <Field label="Featured" htmlFor="f-is_featured">
              <label className="pm-toggle">
                <input
                  id="f-is_featured"
                  type="checkbox"
                  checked={fields.is_featured}
                  onChange={handleField("is_featured")}
                />
                Show on homepage as featured
              </label>
            </Field>
          </div>
        )}

        {activeTab === "location" && (
          <div className="pm-grid">
            <Field
              label="Address / Location"
              htmlFor="f-location"
              hint="Shown on property cards and detail page."
            >
              <input
                id="f-location"
                type="text"
                value={fields.location}
                onChange={handleField("location")}
              />
            </Field>
            <Field label="City" htmlFor="f-city">
              <input
                id="f-city"
                type="text"
                value={fields.city}
                onChange={handleField("city")}
              />
            </Field>
            <Field label="Locality" htmlFor="f-locality">
              <input
                id="f-locality"
                type="text"
                value={fields.locality}
                onChange={handleField("locality")}
              />
            </Field>
            <Field label="Google Map URL" htmlFor="f-map">
              <input
                id="f-map"
                type="url"
                value={fields.google_map_location}
                onChange={handleField("google_map_location")}
              />
            </Field>
          </div>
        )}

        {activeTab === "pricing" && (
          <div className="pm-grid">
            <Field label="Price Type" htmlFor="f-price_type">
              <select
                id="f-price_type"
                value={fields.price_type}
                onChange={handleField("price_type")}
              >
                {PRICE_TYPE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </Field>
            {fields.price_type !== "on_request" && (
              <>
                <Field label="Price (₹)" htmlFor="f-price">
                  <input
                    id="f-price"
                    type="number"
                    min="0"
                    value={fields.price}
                    onChange={handleField("price")}
                  />
                </Field>
                <Field label="Price per sq.ft (₹)" htmlFor="f-pps">
                  <input
                    id="f-pps"
                    type="number"
                    min="0"
                    value={fields.price_per_sqft}
                    onChange={handleField("price_per_sqft")}
                  />
                </Field>
              </>
            )}
          </div>
        )}

        {activeTab === "details" && (
          <>
            <h4 className="pm-subhead">Specifications</h4>
            <div className="pm-grid">
              <Field label="BHK Min" htmlFor="f-bhk_min">
                <input
                  id="f-bhk_min"
                  type="number"
                  min="0"
                  value={fields.bhk_min}
                  onChange={handleField("bhk_min")}
                />
              </Field>
              <Field label="BHK Max" htmlFor="f-bhk_max">
                <input
                  id="f-bhk_max"
                  type="number"
                  min="0"
                  value={fields.bhk_max}
                  onChange={handleField("bhk_max")}
                />
              </Field>
              <Field label="Carpet Area" htmlFor="f-carpet_area">
                <input
                  id="f-carpet_area"
                  type="text"
                  value={fields.carpet_area}
                  onChange={handleField("carpet_area")}
                />
              </Field>
              <Field label="Project Area" htmlFor="f-project_area">
                <input
                  id="f-project_area"
                  type="text"
                  value={fields.project_area}
                  onChange={handleField("project_area")}
                />
              </Field>
              <Field label="Towers" htmlFor="f-towers">
                <input
                  id="f-towers"
                  type="text"
                  value={fields.towers}
                  onChange={handleField("towers")}
                />
              </Field>
              <Field label="Floors" htmlFor="f-floor">
                <input
                  id="f-floor"
                  type="text"
                  value={fields.floor}
                  onChange={handleField("floor")}
                />
              </Field>
              <Field label="No. of Units" htmlFor="f-units">
                <input
                  id="f-units"
                  type="number"
                  min="0"
                  value={fields.no_of_units}
                  onChange={handleField("no_of_units")}
                />
              </Field>
              <Field label="Parking" htmlFor="f-parking">
                <input
                  id="f-parking"
                  type="text"
                  value={fields.parking}
                  onChange={handleField("parking")}
                />
              </Field>
              <Field label="View" htmlFor="f-view">
                <input
                  id="f-view"
                  type="text"
                  value={fields.property_view}
                  onChange={handleField("property_view")}
                />
              </Field>
              <Field label="Possession" htmlFor="f-possession">
                <input
                  id="f-possession"
                  type="date"
                  value={fields.possession}
                  onChange={handleField("possession")}
                />
              </Field>
              <Field label="RERA No." htmlFor="f-rera">
                <input
                  id="f-rera"
                  type="text"
                  value={fields.rera_no}
                  onChange={handleField("rera_no")}
                />
              </Field>
              <Field label="Ownership" htmlFor="f-ownership">
                <input
                  id="f-ownership"
                  type="text"
                  value={fields.ownership}
                  onChange={handleField("ownership")}
                />
              </Field>
            </div>

            <h4 className="pm-subhead">Developer</h4>
            <div className="pm-grid">
              <Field label="Developed By" htmlFor="f-developer">
                <input
                  id="f-developer"
                  type="text"
                  value={fields.developed_by}
                  onChange={handleField("developed_by")}
                />
              </Field>
              <Field label="About Builder Company" htmlFor="f-builder">
                <textarea
                  id="f-builder"
                  rows={3}
                  value={fields.about_builder_company}
                  onChange={handleField("about_builder_company")}
                />
              </Field>
            </div>

            <h4 className="pm-subhead">Content</h4>
            <div className="pm-grid pm-grid--full">
              <Field label="About Property" htmlFor="f-about">
                <textarea
                  id="f-about"
                  rows={4}
                  value={fields.about_property}
                  onChange={handleField("about_property")}
                />
              </Field>
              <Field label="About Location" htmlFor="f-about-location">
                <textarea
                  id="f-about-location"
                  rows={3}
                  value={fields.about_location}
                  onChange={handleField("about_location")}
                />
              </Field>
              <Field label="Explore Neighbourhood" htmlFor="f-neighbourhood">
                <textarea
                  id="f-neighbourhood"
                  rows={3}
                  value={fields.explore_neighbourhood}
                  onChange={handleField("explore_neighbourhood")}
                />
              </Field>
              <TagInput
                label="Key Features"
                tags={keyFeatures}
                onChange={setKeyFeatures}
                placeholder="Type a feature, press Enter"
              />
              <TagInput
                label="Amenities"
                tags={amenities}
                onChange={setAmenities}
                placeholder="Type an amenity, press Enter"
              />
              <ConfigEditor rows={configRows} onChange={setConfigRows} />
            </div>

            <h4 className="pm-subhead">Media</h4>
            <div className="pm-grid">
              <Field label="Cover Image" htmlFor="f-image">
                <input
                  id="f-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Cover preview"
                    className="pm-image-preview"
                  />
                )}
              </Field>
              <Field
                label="Gallery Folder Link"
                htmlFor="f-gallery"
                hint="Google Drive folder link, shown as 'View Gallery' on the detail page."
              >
                <input
                  id="f-gallery"
                  type="url"
                  value={fields.google_drive_url}
                  onChange={handleField("google_drive_url")}
                />
              </Field>
              <Field label="Brochure URL" htmlFor="f-brochure">
                <input
                  id="f-brochure"
                  type="url"
                  value={fields.brochure_url}
                  onChange={handleField("brochure_url")}
                />
              </Field>
            </div>
          </>
        )}

        {activeTab === "seo" && (
          <div className="pm-grid pm-grid--full">
            <Field
              label="SEO Title"
              htmlFor="f-seo-title"
              hint={`${fields.seo_title.length}/60 characters`}
            >
              <input
                id="f-seo-title"
                type="text"
                value={fields.seo_title}
                onChange={handleField("seo_title")}
                maxLength={70}
              />
            </Field>
            <Field
              label="SEO Description"
              htmlFor="f-seo-desc"
              hint={`${fields.seo_description.length}/160 characters`}
            >
              <textarea
                id="f-seo-desc"
                rows={3}
                value={fields.seo_description}
                onChange={handleField("seo_description")}
                maxLength={180}
              />
            </Field>
          </div>
        )}
      </div>

      <div className="pm-form-actions">
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
              Publish Property
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
              type="submit"
              variant="primary"
              disabled={saving}
              loading={saving}
            >
              Save Changes
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

const PropertyModule = () => {
  const [properties, setProperties] = useState([]);
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
    fetchProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isAuthenticated]);

  const fetchProperties = async () => {
    setLoadingList(true);
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .order("id", { ascending: false });
    if (error) console.error("Error fetching properties:", error);
    else setProperties(data ?? []);
    setLoadingList(false);
  };

  const uploadImage = async (imageFile) => {
    const ext = imageFile.name.split(".").pop();
    const path = `${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("property-images")
      .upload(path, imageFile);
    if (uploadError) throw uploadError;
    const { data } = supabase.storage
      .from("property-images")
      .getPublicUrl(path);
    return data.publicUrl;
  };

  const handleCreate = async (payload, imageFile) => {
    setSaving(true);
    try {
      let image_url = "";
      if (imageFile) image_url = await uploadImage(imageFile);
      const { error } = await supabase
        .from("properties")
        .insert([{ ...payload, image_url }]);
      if (error) throw error;
      await fetchProperties();
      return true;
    } catch (err) {
      alert("Error saving property: " + err.message);
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
        .from("properties")
        .update({ ...payload, image_url })
        .eq("id", id);
      if (error) throw error;
      await fetchProperties();
      setEditingId(null);
      return true;
    } catch (err) {
      alert("Error updating property: " + err.message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const deleteProperty = async (id) => {
    if (!window.confirm("Are you sure you want to delete this property?"))
      return;
    const { error } = await supabase.from("properties").delete().eq("id", id);
    if (error) alert("Error deleting property: " + error.message);
    else setProperties((prev) => prev.filter((p) => p.id !== id));
  };

  const editingProperty = useMemo(
    () => properties.find((p) => p.id === editingId) || null,
    [properties, editingId],
  );

  return (
    <div className="pm-module">
      <section className="pm-section pm-section--wide">
        <h2>➕ Add New Property</h2>
        <PropertyForm
          key="create"
          property={null}
          isCreate
          persistDraftToLocalStorage
          saving={saving}
          onSave={handleCreate}
        />
      </section>

      <section className="pm-section">
        <h2>🏠 Existing Properties ({properties.length})</h2>
        {loadingList ? (
          <Spinner showLabel label="Loading properties…" />
        ) : properties.length === 0 ? (
          <p>No properties found.</p>
        ) : (
          <div className="pm-list">
            {properties.map((property) => (
              <div key={property.id} className="pm-card">
                {property.image_url && (
                  <img
                    src={property.image_url}
                    alt={property.name}
                    className="pm-card__image"
                  />
                )}
                <div className="pm-card__details">
                  <div className="pm-card__badges">
                    {!property.is_published && (
                      <Badge variant="warning" size="small">
                        <FaEyeSlash /> Draft
                      </Badge>
                    )}
                    {property.is_featured && (
                      <Badge variant="accent" size="small">
                        <FaStar /> Featured
                      </Badge>
                    )}
                  </div>
                  <h3>{property.name || "Untitled property"}</h3>
                  <p className="pm-card__location">
                    <FaMapMarkerAlt className="icon" />{" "}
                    {property.location || "—"}
                  </p>
                  <p className="pm-card__bhk">
                    <FaBed className="icon" />{" "}
                    {property.bhk_min != null || property.bhk_max != null
                      ? `${property.bhk_min ?? "?"}${property.bhk_max && property.bhk_max !== property.bhk_min ? `-${property.bhk_max}` : ""} BHK`
                      : `${property.bhk || "—"} BHK`}
                  </p>
                  <p className="pm-card__area">
                    <FaRuler className="icon" /> {property.carpet_area || "—"}{" "}
                    Sq Ft
                  </p>
                </div>
                <div className="pm-card__actions">
                  <Button
                    size="small"
                    variant="outline"
                    onClick={() => setEditingId(property.id)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    variant="danger"
                    onClick={() => deleteProperty(property.id)}
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
        title="Edit Property"
        size="large"
      >
        {editingProperty && (
          <PropertyForm
            key={editingProperty.id}
            property={editingProperty}
            isCreate={false}
            saving={saving}
            onCancel={() => setEditingId(null)}
            onSave={(payload, imageFile) =>
              handleUpdate(editingProperty.id, payload, imageFile)
            }
          />
        )}
      </Modal>
    </div>
  );
};

export default PropertyModule;
