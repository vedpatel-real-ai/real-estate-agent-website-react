// src/components/AdminUsers.jsx
//
// Repurposed (Phase F — cleanup, Architecture Plan §10.1/§13) to manage
// the real `admin_users` table instead of the vestigial `admins` table
// (username/bcrypt password_hash), which was never used for real
// authentication (Supabase Auth is) and whose "Allow admin login access"
// RLS policy let any anonymous visitor read every stored password hash.
//
// Promoting someone to admin stays a manual, deliberate action (Plan
// §4): paste in the target user's auth.users UUID (Supabase Dashboard ->
// Authentication -> Users -> copy UUID) rather than any self-service or
// email-based lookup, since client code cannot query auth.users
// directly. No bcryptjs, no client-side password handling anymore.
//
// NOTE: this component alone does not remove the underlying `admins`
// table or its RLS exposure — that's a separate SQL statement
// (`drop table public.admins;`), deliberately left as a manual step;
// see the migration file's closing comment.
import React, { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const AdminUsers = () => {
  const [admins, setAdmins] = useState([]);
  const [newUserId, setNewUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("admin_users")
      .select("id, user_id, is_admin, created_at, profiles(full_name)")
      .order("created_at", { ascending: false });
    if (!error) setAdmins(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    const userId = newUserId.trim();
    if (!userId) return;
    setMsg("");

    const { error } = await supabase
      .from("admin_users")
      .upsert({ user_id: userId, is_admin: true }, { onConflict: "user_id" });

    if (error) {
      setMsg(`Error adding admin: ${error.message}`);
    } else {
      setMsg("Admin added.");
      setNewUserId("");
      fetchAdmins();
    }
  };

  const handleRevoke = async (id) => {
    const confirmed = window.confirm("Remove admin access for this user?");
    if (!confirmed) return;

    const { error } = await supabase.from("admin_users").delete().eq("id", id);
    if (!error) fetchAdmins();
  };

  return (
    <div style={styles.container}>
      <h2>👥 Admins</h2>
      <p style={styles.hint}>
        Grant admin access by pasting a user's ID from Supabase Auth
        (Authentication → Users → copy UUID). This does not create a new account
        — the user must already have signed up.
      </p>

      <form onSubmit={handleAddAdmin} style={styles.form}>
        <input
          type="text"
          placeholder="User UUID"
          value={newUserId}
          onChange={(e) => setNewUserId(e.target.value)}
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button}>
          Grant Admin
        </button>
      </form>
      {msg && <p style={styles.msg}>{msg}</p>}

      {loading ? (
        <p>Loading…</p>
      ) : admins.length === 0 ? (
        <p>No admins yet.</p>
      ) : (
        <ul style={styles.list}>
          {admins.map((row) => (
            <li key={row.id} style={styles.listItem}>
              <span style={styles.listText}>
                {row.profiles?.full_name || row.user_id}
              </span>
              <button
                onClick={() => handleRevoke(row.id)}
                style={styles.revokeButton}
              >
                Revoke
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: 560, width: "100%" },
  hint: {
    fontSize: "0.85rem",
    color: "#666",
    marginBottom: "1.25rem",
    lineHeight: 1.5,
  },
  form: {
    display: "flex",
    gap: "0.75rem",
    marginBottom: "1rem",
    flexWrap: "wrap",
  },
  input: {
    flex: "1 1 240px",
    padding: "0.6rem 0.85rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "0.95rem",
    minWidth: 0,
  },
  button: {
    padding: "0.6rem 1.1rem",
    background: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    whiteSpace: "nowrap",
    width: "100%",
    maxWidth: "180px",
  },
  msg: { fontSize: "0.9rem", marginBottom: "1rem" },
  list: {
    listStyle: "none",
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.75rem 0",
    borderBottom: "1px solid #eee",
    flexWrap: "wrap",
  },
  listText: { overflowWrap: "anywhere", flex: "1 1 220px" },
  revokeButton: {
    background: "#d9534f",
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "0.4rem 0.8rem",
    cursor: "pointer",
    width: "100%",
    maxWidth: "110px",
  },
};

export default AdminUsers;
