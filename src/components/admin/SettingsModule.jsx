// src/components/admin/SettingsModule.jsx
import React, { useEffect, useState } from "react";
import { Settings as SettingsIcon, Save, Plus, Trash2 } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Skeleton from "../ui/Skeleton";
import "./SettingsModule.css";

/**
 * SettingsModule (Package 5.5 — Testimonials Module + Settings)
 *
 * New admin module for the `site_settings` table (redesign plan's schema
 * block: `key text PK` / `value text` / `updated_at timestamptz`,
 * comment listing `'phone_primary'`, `'whatsapp_number'`, `'email'`,
 * `'address'` as example keys). No prior package has shipped a consumer
 * or a seed migration for this table — `WhatsAppButton.jsx` (Package 4.1)
 * explicitly still uses a hardcoded constant, with its own header comment
 * noting it's designed to be "swapped for the `site_settings
 * .whatsapp_number`-backed value in one place once Package 3.6 (Site
 * Settings...) lands." That consumer-side wiring is a separate, not-yet
 * -scheduled package and out of this package's file list (Blueprint row
 * 5.5 lists only this file as a "Files to Create" entry) — this module
 * only provides the admin CRUD surface against the table itself.
 *
 * Because no seed data or fixed key list is defined anywhere in the
 * project artifacts, this is built as a generic key/value manager rather
 * than a hardcoded form for an assumed set of fields: it lists whatever
 * rows already exist in `site_settings`, lets an admin edit any row's
 * value, delete a row, or add a new key/value pair. The plan's four
 * example keys are offered as one-click quick-add suggestions (only shown
 * for keys not already present) so an admin can seed them without typing
 * the key by hand, without this component assuming they already exist.
 *
 * Role/permission scope: this package explicitly does not implement the
 * `admin_users.role` permission matrix (Blueprint gap item #38) — no
 * such column exists yet and no permission matrix is defined anywhere in
 * the Blueprint or redesign plan (only a single line: "Add a user_roles
 * table if multiple admins needed"). Every authenticated admin has full
 * read/write access to this module, matching the access level every
 * other rebuilt admin module currently has. See IMPLEMENTATION_STATE.md
 * for this Known Deviation.
 */

const ADMIN_LOGIN_PATH = "/mppateL123";

const SUGGESTED_KEYS = [
  { key: "phone_primary", label: "Primary Phone" },
  { key: "whatsapp_number", label: "WhatsApp Number" },
  { key: "email", label: "Contact Email" },
  { key: "address", label: "Office Address" },
];

const SETTINGS_LIST_SKELETON_COUNT = 5;

function SettingsListSkeleton() {
  return (
    <div className="sm-list">
      {Array.from({ length: SETTINGS_LIST_SKELETON_COUNT }).map((_, i) => (
        <div className="sm-row" key={i}>
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="100%" height={36} />
          <Skeleton variant="text" width={60} height={30} />
        </div>
      ))}
    </div>
  );
}

const SettingsModule = () => {
  const { isAuthenticated, isLoading } = useAuth();

  const [settings, setSettings] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [drafts, setDrafts] = useState({}); // key -> draft value
  const [savingKey, setSavingKey] = useState(null);
  const [deletingKey, setDeletingKey] = useState(null);

  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [addError, setAddError] = useState("");
  const [adding, setAdding] = useState(false);

  const fetchSettings = async () => {
    setLoadingList(true);
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .order("key", { ascending: true });
    if (error) {
      console.error("Error fetching site settings:", error.message);
      setSettings([]);
    } else {
      setSettings(data ?? []);
      setDrafts(
        Object.fromEntries((data ?? []).map((row) => [row.key, row.value ?? ""])),
      );
    }
    setLoadingList(false);
  };

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      window.location.href = ADMIN_LOGIN_PATH;
      return;
    }
    fetchSettings();
  }, [isLoading, isAuthenticated]);

  const handleDraftChange = (key) => (e) => {
    setDrafts((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const isDirty = (row) => (drafts[row.key] ?? "") !== (row.value ?? "");

  const handleSaveRow = async (row) => {
    setSavingKey(row.key);
    const { error } = await supabase
      .from("site_settings")
      .update({ value: drafts[row.key], updated_at: new Date().toISOString() })
      .eq("key", row.key);
    if (error) {
      alert("Error saving setting: " + error.message);
    } else {
      setSettings((prev) =>
        prev.map((s) => (s.key === row.key ? { ...s, value: drafts[row.key] } : s)),
      );
    }
    setSavingKey(null);
  };

  const handleDeleteRow = async (key) => {
    if (!window.confirm(`Delete the "${key}" setting?`)) return;
    setDeletingKey(key);
    const { error } = await supabase.from("site_settings").delete().eq("key", key);
    if (error) {
      alert("Error deleting setting: " + error.message);
    } else {
      setSettings((prev) => prev.filter((s) => s.key !== key));
      setDrafts((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
    setDeletingKey(null);
  };

  const addSetting = async (key, value) => {
    setAddError("");
    const trimmedKey = key.trim();
    if (!trimmedKey) {
      setAddError("Key is required.");
      return;
    }
    if (settings.some((s) => s.key === trimmedKey)) {
      setAddError(`"${trimmedKey}" already exists — edit it below instead.`);
      return;
    }

    setAdding(true);
    const { error } = await supabase
      .from("site_settings")
      .insert([{ key: trimmedKey, value: value ?? "", updated_at: new Date().toISOString() }]);
    setAdding(false);

    if (error) {
      setAddError(error.message);
      return;
    }
    setNewKey("");
    setNewValue("");
    fetchSettings();
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    addSetting(newKey, newValue);
  };

  const existingKeys = new Set(settings.map((s) => s.key));
  const availableSuggestions = SUGGESTED_KEYS.filter((s) => !existingKeys.has(s.key));

  return (
    <div className="sm-module">
      <section className="sm-section">
        <div className="sm-header">
          <h2>
            <SettingsIcon size={22} aria-hidden="true" /> Site Settings
          </h2>
        </div>

        <p className="sm-intro">
          Manage global site values (contact info, WhatsApp number, address, etc.)
          stored in the <code>site_settings</code> table.
        </p>

        {loadingList ? (
          <SettingsListSkeleton />
        ) : (
          <>
            {settings.length === 0 ? (
              <p>No settings configured yet. Add one below.</p>
            ) : (
              <div className="sm-list">
                {settings.map((row) => (
                  <div className="sm-row" key={row.key}>
                    <div className="sm-row__key">{row.key}</div>
                    <Input
                      value={drafts[row.key] ?? ""}
                      onChange={handleDraftChange(row.key)}
                      placeholder="Value"
                      fullWidth
                      className="sm-row__input"
                    />
                    <div className="sm-row__actions">
                      <Button
                        size="small"
                        variant="primary"
                        disabled={!isDirty(row) || savingKey === row.key}
                        loading={savingKey === row.key}
                        onClick={() => handleSaveRow(row)}
                      >
                        <Save size={14} /> Save
                      </Button>
                      <Button
                        size="small"
                        variant="danger"
                        disabled={deletingKey === row.key}
                        loading={deletingKey === row.key}
                        onClick={() => handleDeleteRow(row.key)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {availableSuggestions.length > 0 && (
              <div className="sm-suggestions">
                <span className="sm-suggestions__label">Quick add:</span>
                {availableSuggestions.map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    className="sm-suggestion-chip"
                    onClick={() => addSetting(s.key, "")}
                    disabled={adding}
                  >
                    <Plus size={12} /> {s.label}
                  </button>
                ))}
              </div>
            )}

            <form className="sm-add-form" onSubmit={handleAddSubmit}>
              <Input
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                placeholder="Setting key (e.g. phone_primary)"
                className="sm-add-form__key"
              />
              <Input
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="Value"
                className="sm-add-form__value"
              />
              <Button type="submit" variant="outline" disabled={adding} loading={adding}>
                <Plus size={14} /> Add Setting
              </Button>
            </form>
            {addError && (
              <p className="sm-add-form__error" role="alert">
                {addError}
              </p>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default SettingsModule;