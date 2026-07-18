import { demoBlogs, demoContact, demoProperties, demoTestimonials, placeholderImage } from "./index.js";

const STORAGE_KEY = "dreamspace-demo-db-v1";

const now = () => new Date().toISOString();

const demoLeads = [
  {
    id: 1,
    name: "Priya Shah",
    email: "priya.shah@example.com",
    phone: "+91 98765 11111",
    subject: "Apartment inquiry",
    message: "I would like to know more about Skyline Residences and available visit slots.",
    property_id: 1,
    property_name: "Skyline Residences",
    lead_type: "property_inquiry",
    status: "new",
    notes: "Interested in east-facing 3 BHK.",
    source_page: "/properties/skyline-residences",
    preferred_budget: "₹1.5 Cr - ₹1.8 Cr",
    preferred_date: "2026-07-24",
    created_at: "2026-07-18T09:30:00.000Z",
    updated_at: "2026-07-18T09:30:00.000Z",
  },
  {
    id: 2,
    name: "Arjun Mehta",
    email: "arjun.mehta@example.com",
    phone: "+91 98765 22222",
    subject: "Office space",
    message: "Need a compact office for a 12-person team with parking.",
    property_id: 3,
    property_name: "Metro Edge Offices",
    lead_type: "site_visit",
    status: "contacted",
    notes: "Asked for weekday morning viewing.",
    source_page: "/contact-us",
    preferred_budget: "₹90 L - ₹1.1 Cr",
    preferred_date: "2026-07-25",
    created_at: "2026-07-17T11:15:00.000Z",
    updated_at: "2026-07-18T06:20:00.000Z",
  },
  {
    id: 3,
    name: "Neha Kapoor",
    email: "neha.kapoor@example.com",
    phone: "+91 98765 33333",
    subject: "Rental help",
    message: "Looking for a furnished 2 BHK rental near Vastrapur.",
    property_id: 4,
    property_name: "Parkview Heights",
    lead_type: "general",
    status: "qualified",
    notes: "Budget confirmed. Follow up with rental agreement checklist.",
    source_page: "/properties",
    preferred_budget: "₹35,000 - ₹45,000/month",
    preferred_date: "2026-07-26",
    created_at: "2026-07-05T14:00:00.000Z",
    updated_at: "2026-07-08T10:10:00.000Z",
  },
];

const demoSettings = [
  { id: 1, key: "phone_primary", value: demoContact.telephone, updated_at: now() },
  { id: 2, key: "whatsapp_number", value: demoContact.whatsappNumber, updated_at: now() },
  { id: 3, key: "email", value: demoContact.email, updated_at: now() },
  {
    id: 4,
    key: "address",
    value: `${demoContact.streetAddress}, ${demoContact.addressLocality}, ${demoContact.addressRegion} ${demoContact.postalCode}`,
    updated_at: now(),
  },
];

const demoProfiles = [
  {
    id: "demo-admin",
    full_name: "Demo Administrator",
    phone: "+91 98765 43210",
    avatar_url: placeholderImage("Admin", 300, 300),
    updated_at: now(),
  },
];

const initialDb = () => ({
  properties: demoProperties.map((property) => ({ ...property })),
  blog_posts: demoBlogs.map((post) => ({ ...post })),
  testimonials: demoTestimonials.map((testimonial) => ({ ...testimonial })),
  form_submissions: demoLeads.map((lead) => ({ ...lead })),
  site_settings: demoSettings.map((setting) => ({ ...setting })),
  admin_users: [
    {
      id: 1,
      user_id: "demo-admin",
      is_admin: true,
      created_at: now(),
      profiles: { full_name: "Demo Administrator" },
    },
  ],
  profiles: demoProfiles.map((profile) => ({ ...profile })),
  favourites: [
    {
      id: 1,
      user_id: "demo-admin",
      property_id: 1,
      created_at: now(),
    },
  ],
});

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadDb() {
  if (typeof window === "undefined") return initialDb();
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? { ...initialDb(), ...JSON.parse(stored) } : initialDb();
  } catch {
    return initialDb();
  }
}

function saveDb(db) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

const db = loadDb();

function getRows(table) {
  if (!db[table]) db[table] = [];
  return db[table];
}

function nextId(rows) {
  return rows.reduce((max, row) => Math.max(max, Number(row.id) || 0), 0) + 1;
}

function parseSelectColumns(selectValue) {
  if (!selectValue || selectValue === "*") return null;
  return selectValue
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item && !item.includes("("));
}

function projectRows(table, rows, selectValue) {
  if (table === "favourites" && selectValue?.includes("properties(*)")) {
    return rows.map((row) => ({
      ...row,
      properties: getRows("properties").find((property) => property.id === row.property_id) || null,
    }));
  }

  if (table === "admin_users" && selectValue?.includes("profiles(")) {
    return rows.map((row) => ({
      ...row,
      profiles:
        row.profiles ||
        getRows("profiles").find((profile) => profile.id === row.user_id) ||
        null,
    }));
  }

  const columns = parseSelectColumns(selectValue);
  if (!columns) return rows;
  return rows.map((row) =>
    Object.fromEntries(columns.map((column) => [column, row[column]])),
  );
}

function matchesCondition(row, { column, op, value }) {
  const actual = row[column];
  if (op === "eq") return String(actual ?? "") === String(value);
  if (op === "gte") return actual >= value;
  if (op === "lte") return actual <= value;
  if (op === "in") return Array.isArray(value) && value.includes(actual);
  if (op === "ilike") {
    const term = String(value).replaceAll("%", "").toLowerCase();
    return String(actual ?? "").toLowerCase().includes(term);
  }
  if (op === "is") return value === null ? actual == null : actual === value;
  if (op === "not_is") return value === null ? actual != null : actual !== value;
  return true;
}

function matchesOr(row, expression) {
  return expression.split(",").some((clause) => {
    const parts = clause.split(".");
    const [column, op, ...rest] = parts;
    const value = rest.join(".");
    if (op === "is" && value === "null") return row[column] == null;
    if (op === "eq") return String(row[column] ?? "") === value;
    if (op === "ilike") return matchesCondition(row, { column, op, value });
    return true;
  });
}

class DemoQueryBuilder {
  constructor(table) {
    this.table = table;
    this.action = "select";
    this.selectValue = "*";
    this.options = {};
    this.filters = [];
    this.orFilters = [];
    this.orderSpec = null;
    this.rangeSpec = null;
    this.limitCount = null;
    this.payload = null;
    this.upsertOptions = {};
  }

  select(value = "*", options = {}) {
    this.action = "select";
    this.selectValue = value;
    this.options = options;
    return this;
  }

  insert(payload) {
    this.action = "insert";
    this.payload = Array.isArray(payload) ? payload : [payload];
    return this.execute();
  }

  upsert(payload, options = {}) {
    this.action = "upsert";
    this.payload = Array.isArray(payload) ? payload : [payload];
    this.upsertOptions = options;
    return this.execute();
  }

  update(payload) {
    this.action = "update";
    this.payload = payload;
    return this;
  }

  delete() {
    this.action = "delete";
    return this;
  }

  eq(column, value) {
    this.filters.push({ column, op: "eq", value });
    return this;
  }

  gte(column, value) {
    this.filters.push({ column, op: "gte", value });
    return this;
  }

  lte(column, value) {
    this.filters.push({ column, op: "lte", value });
    return this;
  }

  in(column, value) {
    this.filters.push({ column, op: "in", value });
    return this;
  }

  ilike(column, value) {
    this.filters.push({ column, op: "ilike", value });
    return this;
  }

  not(column, op, value) {
    this.filters.push({ column, op: `not_${op}`, value });
    return this;
  }

  or(expression) {
    this.orFilters.push(expression);
    return this;
  }

  order(column, options = {}) {
    this.orderSpec = { column, ascending: options.ascending !== false };
    return this;
  }

  range(from, to) {
    this.rangeSpec = { from, to };
    return this;
  }

  limit(count) {
    this.limitCount = count;
    return this;
  }

  single() {
    return this.execute().then((result) => ({
      ...result,
      data: Array.isArray(result.data) ? result.data[0] ?? null : result.data,
    }));
  }

  maybeSingle() {
    return this.single();
  }

  then(resolve, reject) {
    return this.execute().then(resolve, reject);
  }

  catch(reject) {
    return this.execute().catch(reject);
  }

  finally(callback) {
    return this.execute().finally(callback);
  }

  filteredRows() {
    return getRows(this.table).filter(
      (row) =>
        this.filters.every((filter) => matchesCondition(row, filter)) &&
        this.orFilters.every((expression) => matchesOr(row, expression)),
    );
  }

  async execute() {
    try {
      if (this.action === "insert") return this.insertRows();
      if (this.action === "upsert") return this.upsertRows();
      if (this.action === "update") return this.updateRows();
      if (this.action === "delete") return this.deleteRows();
      return this.selectRows();
    } catch (error) {
      return { data: null, error, count: null };
    }
  }

  selectRows() {
    let rows = this.filteredRows();
    const count = this.options.count ? rows.length : null;

    if (this.orderSpec) {
      const { column, ascending } = this.orderSpec;
      rows = [...rows].sort((a, b) => {
        const left = a[column] ?? "";
        const right = b[column] ?? "";
        if (left === right) return 0;
        return (left > right ? 1 : -1) * (ascending ? 1 : -1);
      });
    }

    if (this.rangeSpec) {
      rows = rows.slice(this.rangeSpec.from, this.rangeSpec.to + 1);
    } else if (this.limitCount != null) {
      rows = rows.slice(0, this.limitCount);
    }

    return {
      data: this.options.head ? null : clone(projectRows(this.table, rows, this.selectValue)),
      error: null,
      count,
    };
  }

  insertRows() {
    const rows = getRows(this.table);
    const inserted = this.payload.map((item) => ({
      ...item,
      id: item.id ?? nextId(rows),
      created_at: item.created_at ?? now(),
      updated_at: item.updated_at ?? now(),
    }));
    rows.push(...inserted);
    saveDb(db);
    return { data: clone(inserted), error: null, count: inserted.length };
  }

  upsertRows() {
    const rows = getRows(this.table);
    const conflictKeys = (this.upsertOptions.onConflict || "id")
      .split(",")
      .map((key) => key.trim());
    const written = [];

    for (const item of this.payload) {
      const existing = rows.find((row) =>
        conflictKeys.every((key) => String(row[key]) === String(item[key])),
      );
      if (existing) {
        Object.assign(existing, item, { updated_at: item.updated_at ?? now() });
        written.push(existing);
      } else {
        const row = {
          ...item,
          id: item.id ?? nextId(rows),
          created_at: item.created_at ?? now(),
          updated_at: item.updated_at ?? now(),
        };
        rows.push(row);
        written.push(row);
      }
    }

    saveDb(db);
    return { data: clone(written), error: null, count: written.length };
  }

  updateRows() {
    const rows = this.filteredRows();
    rows.forEach((row) => Object.assign(row, this.payload, { updated_at: this.payload.updated_at ?? now() }));
    saveDb(db);
    return { data: clone(rows), error: null, count: rows.length };
  }

  deleteRows() {
    const rows = getRows(this.table);
    const matches = new Set(this.filteredRows().map((row) => row.id));
    db[this.table] = rows.filter((row) => !matches.has(row.id));
    saveDb(db);
    return { data: null, error: null, count: matches.size };
  }
}

export function createDemoDatabase() {
  return {
    from: (table) => new DemoQueryBuilder(table),
  };
}
