// src/pages/Dashboard.jsx
//
// New (Auth & Favourites Architecture Plan §5) — minimal signed-in-user
// home base: saved/favourited properties (reusing PropertyCard, same as
// every other listing surface in the app) plus a small editable profile
// block backed by the `profiles` table from the Phase A migration
// (auto-created for every user via the handle_new_user trigger, so this
// page can assume a row already exists rather than needing its own
// insert path). Guarded by UserProtectedRoute (any signed-in user, not
// just admins).
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { useFavourites } from "../hooks/useFavourites";
import PropertyCard from "../components/PropertyCard";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import "./Dashboard.css";

function useProfile(userId) {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, phone, avatar_url")
        .eq("id", userId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
    staleTime: 60_000,
  });
}

function useDashboardFavourites(userId) {
  return useQuery({
    queryKey: ["dashboard-favourites", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("favourites")
        .select("property_id, properties(*)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data.map((row) => row.properties).filter(Boolean);
    },
    enabled: !!userId,
    staleTime: 30_000,
  });
}

const Dashboard = () => {
  const { user, signOut, isAdmin } = useAuth();
  const { toggleFavourite } = useFavourites();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const userId = user?.id;

  const { data: profile, isLoading: profileLoading } = useProfile(userId);
  const { data: favourites, isLoading: favouritesLoading } =
    useDashboardFavourites(userId);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setPhone(profile.phone || "");
    }
  }, [profile]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setSaveMsg("");
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName.trim(),
          phone: phone.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
      setSaveMsg("Saved.");
    } catch (err) {
      setSaveMsg(err.message || "Could not save your changes.");
    } finally {
      setSavingProfile(false);
      setTimeout(() => setSaveMsg(""), 3000);
    }
  };

  const handleRemoveFavourite = (propertyId) => {
    toggleFavourite(propertyId);
    // Optimistic local update so the card disappears immediately instead
    // of waiting on the next favourites list refetch.
    queryClient.setQueryData(["dashboard-favourites", userId], (old = []) =>
      old.filter((p) => p.id !== propertyId),
    );
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/login", { replace: true });
  };

  return (
    <div className="dashboard-page container">
      <header className="dashboard-header">
        <h1>My Account</h1>
        <Button variant="outline" size="small" onClick={handleSignOut}>
          Sign Out
        </Button>
      </header>

      {isAdmin && (
        <section className="dashboard-admin-banner">
          <ShieldCheck size={16} aria-hidden="true" />
          <span className="dashboard-admin-label">Admin</span>
          <Button
            variant="primary"
            size="small"
            onClick={() => {
              try {
                // eslint-disable-next-line no-console
                console.log("[Dashboard] admin button clicked");
              } catch (e) {}
              navigate("/admin");
            }}
          >
            Go to Admin Panel
          </Button>
        </section>
      )}

      <section className="dashboard-profile">
        <h2>Profile</h2>
        {profileLoading ? (
          <Spinner
            size="small"
            variant="primary"
            label="Loading profile…"
            showLabel
          />
        ) : (
          <form onSubmit={handleSaveProfile} className="dashboard-profile-form">
            <label className="dashboard-profile-field">
              Full name
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your name"
              />
            </label>
            <label className="dashboard-profile-field">
              Phone
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Your phone number"
              />
            </label>
            <label className="dashboard-profile-field dashboard-profile-email">
              Email
              <input value={user?.email || ""} disabled />
            </label>
            <div className="dashboard-profile-actions">
              <Button
                type="submit"
                variant="primary"
                size="small"
                fullWidth
                loading={savingProfile}
              >
                Save
              </Button>
              {saveMsg && <span className="dashboard-save-msg">{saveMsg}</span>}
            </div>
          </form>
        )}
      </section>

      <section className="dashboard-favourites">
        <h2>Saved Properties</h2>
        {favouritesLoading ? (
          <Spinner
            size="small"
            variant="primary"
            label="Loading saved properties…"
            showLabel
          />
        ) : favourites?.length ? (
          <div className="dashboard-favourites-grid">
            {favourites.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                viewMode="grid"
                isFavourite
                onToggleFavourite={() => handleRemoveFavourite(property.id)}
              />
            ))}
          </div>
        ) : (
          <p className="dashboard-empty">
            You haven't saved any properties yet. Tap the heart icon on any
            listing to save it here.
          </p>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
