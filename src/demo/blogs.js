import { placeholderImage } from "./placeholders.js";

export const demoBlogs = [
  {
    id: 1,
    slug: "how-to-shortlist-a-home",
    title: "How to Shortlist a Home With Confidence",
    excerpt: "A practical framework for comparing location, layout, budget, and long-term livability before booking site visits.",
    content: "Choosing a home becomes easier when you compare the same factors across every option: commute, building quality, usable space, monthly cost, amenities, and resale potential. Start with non-negotiables, then score each property honestly after every visit.",
    category: "Buying Guide",
    image_url: placeholderImage("Buying Guide", 1200, 700),
    is_published: true,
    created_at: "2026-06-10T09:00:00.000Z",
  },
  {
    id: 2,
    slug: "questions-before-renting",
    title: "Questions to Ask Before Renting an Apartment",
    excerpt: "Use these simple checks to understand maintenance, deposits, furnishing, parking, and neighbourhood fit.",
    content: "Before renting, clarify the deposit, lock-in period, maintenance charges, repair responsibilities, parking rights, and move-out terms. A clear conversation early prevents surprises later.",
    category: "Renting",
    image_url: placeholderImage("Renting Tips", 1200, 700),
    is_published: true,
    created_at: "2026-05-24T09:00:00.000Z",
  },
  {
    id: 3,
    slug: "commercial-space-basics",
    title: "Commercial Space Basics for Growing Teams",
    excerpt: "A concise guide to matching office size, location, access, and building services with your team plan.",
    content: "Commercial real estate decisions should consider employee commute, client access, expansion flexibility, power backup, parking, and operating costs. The best office is the one your team can use comfortably every day.",
    category: "Commercial",
    image_url: placeholderImage("Commercial Realty", 1200, 700),
    is_published: true,
    created_at: "2026-05-08T09:00:00.000Z",
  },
];
