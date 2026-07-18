// src/components/admin/LeadsModule.jsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Papa from "papaparse";
import {
  Search,
  Download,
  Phone,
  StickyNote,
  Trash2,
  ArrowUp,
  ArrowDown,
  Users,
  CalendarDays,
  CalendarRange,
  MailOpen,
  X,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { buildWhatsAppHref } from "../shared/WhatsAppButton";
import usePagination from "../../hooks/usePagination";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import Spinner from "../ui/Spinner";
import Skeleton from "../ui/Skeleton";
import Pagination from "../ui/Pagination";
import Textarea from "../ui/Textarea";
import "./LeadsModule.css";

/**
 * LeadsModule (Package 5.4 — Leads Module Rebuild)
 *
 * Replaces the old read/delete-only panel (Blueprint Section 9/Part A §3,
 * gap item #35: "no status field, no search, no export, `console.log`
 * debug leftover") with the full pipeline spec: status workflow, lead-type
 * filter, search, server-side pagination (20/page), WhatsApp quick-reply,
 * internal notes, CSV export, and a stats row.
 *
 * Table/column notes (no schema changes are in this package's scope —
 * every field below reads/writes a column defined by Package 2.1's
 * additive migration onto the existing `form_submissions` table, per the
 * redesign plan's `leads (rename from form_submissions)` schema block
 * and the Blueprint's own gap item #36 column list):
 *  - `lead_type` ('general' | 'property_inquiry' | 'site_visit'),
 *    `status` ('new' | 'contacted' | 'qualified' | 'closed'), `notes` —
 *    all new in 2.1. This is the first shipped package to read/write
 *    them, so — unlike 5.2/5.3's fields — there's no prior shipped
 *    consumer to cross-check them against. Flagged as a Known Deviation
 *    in IMPLEMENTATION_STATE.md rather than blocked on, consistent with
 *    the precedent 5.2 set for `properties.seo_title`/`seo_description`.
 *  - `source_page` / `preferred_budget` / `preferred_date` (2.1, per
 *    Blueprint gap item #36) are written by the public lead forms
 *    (Phase 4), not this admin package. They're surfaced read-only in
 *    each lead's expandable detail panel when present, but are not this
 *    package's write responsibility.
 *  - Existing pre-migration rows have no backfill for the new columns
 *    (an additive `ALTER TABLE ADD COLUMN` does not retroactively
 *    populate old rows even when a `DEFAULT` is specified for future
 *    inserts) — every read/filter/display path below treats a `null`
 *    `lead_type` as `'general'` and a `null` `status` as `'new'` so
 *    older leads display and filter correctly rather than falling
 *    through the cracks.
 *
 * Table name: the redesign plan's schema block header reads "leads
 * (rename from form_submissions)", but Package 2.1 (already implemented)
 * is documented as an *additive* migration — new columns on the existing
 * table, 51 existing rows preserved, no table rename — so this package
 * continues to query `form_submissions`, matching every other shipped
 * consumer (`ContactUs.jsx`, `PropertyDetailPage.jsx`'s inquiry/site-visit
 * forms). Renaming the table is a bigger, cross-cutting decision this
 * package does not own.
 *
 * CSV export uses `papaparse` per the redesign plan's explicit directive
 * ("Export filtered leads to CSV (client-side using Papa.parse
 * serialize)") — added as a new dependency (`package.json`) the same way
 * Package 5.3 added the TipTap tree for its own explicitly-specified
 * library.
 *
 * The `notify-new-lead` Supabase Edge Function (this package's other
 * Blueprint "Files to Create" entry) ships alongside this component at
 * `supabase/functions/notify-new-lead/index.ts` — see that file's header
 * comment for the DB-webhook + Resend wiring this app-code package does
 * not itself execute (deployment step, out of this package's file scope
 * per the Database Rules: "do not modify backend architecture").
 */

const ADMIN_LOGIN_PATH = "/mppateL123";
const LEADS_PAGE_SIZE = 20;
const CSV_EXPORT_ROW_CAP = 5000;

const LEAD_TYPE_OPTIONS = [
  { value: "all", label: "All Types" },
  { value: "general", label: "General Inquiry" },
  { value: "property_inquiry", label: "Property Inquiry" },
  { value: "site_visit", label: "Site Visit Request" },
];

const LEAD_TYPE_LABELS = {
  general: "General Inquiry",
  property_inquiry: "Property Inquiry",
  site_visit: "Site Visit Request",
};

// Status pipeline: New → Contacted → Qualified → Closed (redesign plan's
// `leads.status` schema note: 'new' | 'contacted' | 'qualified' | 'closed').
const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "closed", label: "Closed" },
];

const STATUS_LABELS = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  closed: "Closed",
};

// Badge color mapping for the pipeline's four stages — progressing from
// "needs attention" (info blue) through to "done" (success green).
const STATUS_BADGE_VARIANT = {
  new: "info",
  contacted: "warning",
  qualified: "accent",
  closed: "success",
};

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
];

function normalizeLeadType(rawType) {
  return rawType && LEAD_TYPE_LABELS[rawType] ? rawType : "general";
}

function normalizeStatus(rawStatus) {
  return rawStatus && STATUS_LABELS[rawStatus] ? rawStatus : "new";
}

function formatDate(iso) {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// wa.me links require digits-only, country-code-prefixed numbers. Lead
// phone numbers are collected as free text by the public forms, so this
// normalizes the common Indian 10-digit case; anything else is passed
// through digit-stripped as a best effort.
function normalizePhoneForWhatsApp(phone) {
  const digits = (phone || "").replace(/\D/g, "");
  if (!digits) return null;
  if (digits.length === 10) return `91${digits}`;
  return digits;
}

function buildLeadWhatsAppMessage(lead) {
  const name = lead.name || "there";
  if (lead.property_name) {
    return `Hi ${name}, thanks for your interest in ${lead.property_name}. This is DreamSpace Properties — how can we help?`;
  }
  return `Hi ${name}, thanks for reaching out to DreamSpace Properties. How can we help?`;
}

function buildQueryPredicate(query, { leadType, status, search }) {
  let next = query;

  if (leadType && leadType !== "all") {
    next =
      leadType === "general"
        ? next.or("lead_type.eq.general,lead_type.is.null")
        : next.eq("lead_type", leadType);
  }

  if (status && status !== "all") {
    next =
      status === "new"
        ? next.or("status.eq.new,status.is.null")
        : next.eq("status", status);
  }

  const term = (search || "").trim();
  if (term) {
    next = next.or(
      `name.ilike.%${term}%,email.ilike.%${term}%,phone.ilike.%${term}%,property_name.ilike.%${term}%`,
    );
  }

  return next;
}

/* ------------------------------------------------------------------ */
/* Stats row                                                           */
/* ------------------------------------------------------------------ */

function StatCard({ icon: Icon, label, value, loading }) {
  return (
    <div className="lm-stat-card">
      <div className="lm-stat-card__icon">
        <Icon size={20} aria-hidden="true" />
      </div>
      <div className="lm-stat-card__body">
        <span className="lm-stat-card__value">
          {loading ? <Spinner size="small" /> : (value ?? 0)}
        </span>
        <span className="lm-stat-card__label">{label}</span>
      </div>
    </div>
  );
}

function useLeadStats(refreshKey) {
  const [stats, setStats] = useState({
    total: null,
    newToday: null,
    thisMonth: null,
    unread: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchStats = async () => {
      setLoading(true);
      const now = new Date();
      const todayStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
      ).toISOString();
      const monthStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        1,
      ).toISOString();

      const [totalRes, todayRes, monthRes, unreadRes] = await Promise.all([
        supabase
          .from("form_submissions")
          .select("id", { count: "exact", head: true }),
        supabase
          .from("form_submissions")
          .select("id", { count: "exact", head: true })
          .gte("created_at", todayStart),
        supabase
          .from("form_submissions")
          .select("id", { count: "exact", head: true })
          .gte("created_at", monthStart),
        supabase
          .from("form_submissions")
          .select("id", { count: "exact", head: true })
          .or("status.eq.new,status.is.null"),
      ]);

      if (!isMounted) return;
      setStats({
        total: totalRes.count ?? 0,
        newToday: todayRes.count ?? 0,
        thisMonth: monthRes.count ?? 0,
        unread: unreadRes.count ?? 0,
      });
      setLoading(false);
    };

    fetchStats();
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  return { stats, loading };
}

/* ------------------------------------------------------------------ */
/* Lead row                                                             */
/* ------------------------------------------------------------------ */

function LeadRow({
  lead,
  expanded,
  onToggleExpand,
  onStatusChange,
  onSaveNotes,
  onDelete,
  savingStatus,
  savingNotes,
}) {
  const [notesDraft, setNotesDraft] = useState(lead.notes || "");

  useEffect(() => {
    setNotesDraft(lead.notes || "");
  }, [lead.notes]);

  const leadType = normalizeLeadType(lead.lead_type);
  const status = normalizeStatus(lead.status);
  const waNumber = normalizePhoneForWhatsApp(lead.phone);

  return (
    <>
      <tr className="lm-row">
        <td data-label="Name">
          <span className="lm-row__name">{lead.name || "—"}</span>
        </td>
        <td data-label="Phone">
          {lead.phone ? (
            <a href={`tel:${lead.phone}`} className="lm-row__link">
              {lead.phone}
            </a>
          ) : (
            "—"
          )}
        </td>
        <td data-label="Email">{lead.email || "—"}</td>
        <td data-label="Lead type">
          <Badge variant="neutral" size="small">
            {LEAD_TYPE_LABELS[leadType]}
          </Badge>
        </td>
        <td data-label="Property">{lead.property_name || "—"}</td>
        <td data-label="Status">
          <select
            className="lm-status-select"
            value={status}
            disabled={savingStatus}
            onChange={(e) => onStatusChange(lead.id, e.target.value)}
            aria-label={`Status for lead from ${lead.name || "unknown"}`}
          >
            {STATUS_OPTIONS.filter((opt) => opt.value !== "all").map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <Badge
            variant={STATUS_BADGE_VARIANT[status]}
            size="small"
            className="lm-status-badge"
          >
            {STATUS_LABELS[status]}
          </Badge>
        </td>
        <td data-label="Date">{formatDate(lead.created_at)}</td>
        <td data-label="Actions">
          <div className="lm-row__actions">
            {lead.phone && (
              <a
                href={`tel:${lead.phone}`}
                className="lm-icon-btn"
                aria-label={`Call ${lead.name || "lead"}`}
                title="Call"
              >
                <Phone size={16} />
              </a>
            )}
            {waNumber && (
              <a
                href={buildWhatsAppHref(
                  buildLeadWhatsAppMessage(lead),
                  waNumber,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="lm-icon-btn lm-icon-btn--whatsapp"
                aria-label={`WhatsApp ${lead.name || "lead"}`}
                title="WhatsApp"
              >
                <FaWhatsapp size={16} />
              </a>
            )}
            <button
              type="button"
              className={`lm-icon-btn ${expanded ? "lm-icon-btn--active" : ""}`}
              onClick={() => onToggleExpand(lead.id)}
              aria-label={
                expanded ? "Hide details and notes" : "Show details and notes"
              }
              aria-expanded={expanded}
              title="Notes & details"
            >
              <StickyNote size={16} />
            </button>
            <button
              type="button"
              className="lm-icon-btn lm-icon-btn--danger"
              onClick={() => onDelete(lead.id)}
              aria-label={`Delete lead from ${lead.name || "unknown"}`}
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </td>
      </tr>
      {expanded && (
        <tr className="lm-row lm-row--details">
          <td colSpan={8}>
            <div className="lm-details">
              {lead.subject && (
                <p>
                  <strong>Subject:</strong> {lead.subject}
                </p>
              )}
              {lead.message && (
                <p>
                  <strong>Message:</strong> {lead.message}
                </p>
              )}
              {lead.preferred_date && (
                <p>
                  <strong>Preferred visit date:</strong> {lead.preferred_date}
                </p>
              )}
              {lead.preferred_budget && (
                <p>
                  <strong>Preferred budget:</strong> {lead.preferred_budget}
                </p>
              )}
              {lead.source_page && (
                <p>
                  <strong>Submitted from:</strong> {lead.source_page}
                </p>
              )}
              <Textarea
                label="Internal notes"
                value={notesDraft}
                onChange={(e) => setNotesDraft(e.target.value)}
                placeholder="Add a private note about this lead…"
                rows={3}
              />
              <div className="lm-details__actions">
                <Button
                  size="small"
                  variant="primary"
                  disabled={savingNotes}
                  loading={savingNotes}
                  onClick={() => onSaveNotes(lead.id, notesDraft)}
                >
                  Save Notes
                </Button>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Main module                                                         */
/* ------------------------------------------------------------------ */

const LEADS_LIST_SKELETON_COUNT = 6;

function LeadsTableSkeleton() {
  return (
    <div className="lm-table-wrap">
      <table className="lm-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Lead type</th>
            <th>Property</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: LEADS_LIST_SKELETON_COUNT }).map((_, i) => (
            <tr className="lm-row" key={i}>
              <td data-label="Name">
                <Skeleton variant="text" width="80%" />
              </td>
              <td data-label="Phone">
                <Skeleton variant="text" width="70%" />
              </td>
              <td data-label="Email">
                <Skeleton variant="text" width="90%" />
              </td>
              <td data-label="Lead type">
                <Skeleton variant="text" width={70} />
              </td>
              <td data-label="Property">
                <Skeleton variant="text" width="80%" />
              </td>
              <td data-label="Status">
                <Skeleton variant="text" width={90} />
              </td>
              <td data-label="Date">
                <Skeleton variant="text" width={80} />
              </td>
              <td data-label="Actions">
                <Skeleton variant="text" width={60} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const LeadsModule = () => {
  const { isAuthenticated, isLoading } = useAuth();

  const [leads, setLeads] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [leadType, setLeadType] = useState("all");
  const [status, setStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const [expandedId, setExpandedId] = useState(null);
  const [savingStatusId, setSavingStatusId] = useState(null);
  const [savingNotesId, setSavingNotesId] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [statsRefreshKey, setStatsRefreshKey] = useState(0);

  const { stats, loading: statsLoading } = useLeadStats(statsRefreshKey);

  const { currentPage, totalPages, offset, goToPage, resetPage } =
    usePagination({
      pageSize: LEADS_PAGE_SIZE,
      totalCount,
    });

  // Debounce free-text search so every keystroke doesn't trigger a query.
  useEffect(() => {
    const handle = setTimeout(() => setSearch(searchInput.trim()), 350);
    return () => clearTimeout(handle);
  }, [searchInput]);

  // Any filter change should snap back to page 1 rather than showing a
  // (likely empty) stale page under the new filter set.
  useEffect(() => {
    resetPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, leadType, status, sortBy]);

  const fetchLeads = useCallback(async () => {
    setLoadingList(true);
    let query = supabase
      .from("form_submissions")
      .select("*", { count: "exact" });
    query = buildQueryPredicate(query, { leadType, status, search });
    query = query.order("created_at", { ascending: sortBy === "oldest" });
    query = query.range(offset, offset + LEADS_PAGE_SIZE - 1);

    const { data, error, count } = await query;
    if (error) {
      console.error("Error fetching leads:", error.message);
      setLeads([]);
      setTotalCount(0);
    } else {
      setLeads(data ?? []);
      setTotalCount(count ?? 0);
    }
    setLoadingList(false);
  }, [leadType, status, search, sortBy, offset]);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      window.location.href = ADMIN_LOGIN_PATH;
      return;
    }
    fetchLeads();
  }, [isLoading, isAuthenticated, fetchLeads]);

  const handleStatusChange = async (id, newStatus) => {
    setSavingStatusId(id);
    const { error } = await supabase
      .from("form_submissions")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) {
      alert("Error updating status: " + error.message);
    } else {
      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === id ? { ...lead, status: newStatus } : lead,
        ),
      );
      setStatsRefreshKey((k) => k + 1);
    }
    setSavingStatusId(null);
  };

  const handleSaveNotes = async (id, notes) => {
    setSavingNotesId(id);
    const { error } = await supabase
      .from("form_submissions")
      .update({ notes, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) {
      alert("Error saving notes: " + error.message);
    } else {
      setLeads((prev) =>
        prev.map((lead) => (lead.id === id ? { ...lead, notes } : lead)),
      );
    }
    setSavingNotesId(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    const { error } = await supabase
      .from("form_submissions")
      .delete()
      .eq("id", id);
    if (error) {
      alert("Error deleting lead: " + error.message);
    } else {
      setLeads((prev) => prev.filter((lead) => lead.id !== id));
      setTotalCount((prev) => Math.max(0, prev - 1));
      setStatsRefreshKey((k) => k + 1);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleExportCsv = async () => {
    setExporting(true);
    try {
      let query = supabase.from("form_submissions").select("*");
      query = buildQueryPredicate(query, { leadType, status, search });
      query = query
        .order("created_at", { ascending: sortBy === "oldest" })
        .limit(CSV_EXPORT_ROW_CAP);

      const { data, error } = await query;
      if (error) throw error;

      const rows = (data ?? []).map((lead) => ({
        id: lead.id,
        name: lead.name || "",
        phone: lead.phone || "",
        email: lead.email || "",
        lead_type: LEAD_TYPE_LABELS[normalizeLeadType(lead.lead_type)],
        property_name: lead.property_name || "",
        status: STATUS_LABELS[normalizeStatus(lead.status)],
        subject: lead.subject || "",
        message: lead.message || "",
        notes: lead.notes || "",
        source_page: lead.source_page || "",
        preferred_budget: lead.preferred_budget || "",
        preferred_date: lead.preferred_date || "",
        created_at: lead.created_at || "",
      }));

      const csv = Papa.unparse(rows);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const dateStamp = new Date().toISOString().slice(0, 10);
      link.href = url;
      link.download = `urbanedge-leads-${dateStamp}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Error exporting leads: " + err.message);
    } finally {
      setExporting(false);
    }
  };

  const hasActiveFilters = useMemo(
    () => search || leadType !== "all" || status !== "all",
    [search, leadType, status],
  );

  const clearFilters = () => {
    setSearchInput("");
    setLeadType("all");
    setStatus("all");
  };

  return (
    <div className="lm-module">
      <section className="lm-section">
        <h2>📩 Leads</h2>

        <div className="lm-stats-row">
          <StatCard
            icon={Users}
            label="Total Leads"
            value={stats.total}
            loading={statsLoading}
          />
          <StatCard
            icon={CalendarDays}
            label="New Today"
            value={stats.newToday}
            loading={statsLoading}
          />
          <StatCard
            icon={CalendarRange}
            label="This Month"
            value={stats.thisMonth}
            loading={statsLoading}
          />
          <StatCard
            icon={MailOpen}
            label="Unread (New)"
            value={stats.unread}
            loading={statsLoading}
          />
        </div>

        <div className="lm-toolbar">
          <div className="lm-search">
            <Search size={16} className="lm-search__icon" aria-hidden="true" />
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name, phone, email, or property…"
              aria-label="Search leads"
            />
          </div>

          <select
            className="lm-select"
            value={leadType}
            onChange={(e) => setLeadType(e.target.value)}
            aria-label="Filter by lead type"
          >
            {LEAD_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <select
            className="lm-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            aria-label="Filter by status"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <select
            className="lm-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort by date"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <Button size="small" variant="ghost" onClick={clearFilters}>
              <X size={14} /> Clear
            </Button>
          )}

          <Button
            size="small"
            variant="outline"
            onClick={handleExportCsv}
            disabled={exporting || totalCount === 0}
            loading={exporting}
            className="lm-export-btn"
          >
            <Download size={14} /> Export CSV
          </Button>
        </div>

        {loadingList ? (
          <LeadsTableSkeleton />
        ) : leads.length === 0 ? (
          <p>
            No leads found{hasActiveFilters ? " for the current filters." : "."}
          </p>
        ) : (
          <>
            <div className="lm-table-wrap">
              <table className="lm-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Lead type</th>
                    <th>Property</th>
                    <th>Status</th>
                    <th>
                      <button
                        type="button"
                        className="lm-sort-header"
                        onClick={() =>
                          setSortBy(sortBy === "newest" ? "oldest" : "newest")
                        }
                      >
                        Date{" "}
                        {sortBy === "newest" ? (
                          <ArrowDown size={12} />
                        ) : (
                          <ArrowUp size={12} />
                        )}
                      </button>
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <LeadRow
                      key={lead.id}
                      lead={lead}
                      expanded={expandedId === lead.id}
                      onToggleExpand={toggleExpand}
                      onStatusChange={handleStatusChange}
                      onSaveNotes={handleSaveNotes}
                      onDelete={handleDelete}
                      savingStatus={savingStatusId === lead.id}
                      savingNotes={savingNotesId === lead.id}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
            />
          </>
        )}
      </section>
    </div>
  );
};

export default LeadsModule;
