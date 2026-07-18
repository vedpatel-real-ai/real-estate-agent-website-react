// src/pages/public/PropertyDetailPage.jsx
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MdCheckCircle,
  MdExpandMore,
  MdExpandLess,
  MdOutlineCalendarToday,
  MdOutlineLocationOn,
  MdHome,
  MdFitnessCenter,
  MdLocalParking,
  MdOutlinePhotoLibrary,
  MdOutlineCalendarMonth,
} from "react-icons/md";
import {
  FaBed,
  FaRuler,
  FaDownload,
  FaBuilding,
  FaRulerCombined,
  FaRegBuilding,
  FaIdCard,
} from "react-icons/fa";

import { useProperty } from "../../hooks/useProperty";
import AmenitiesGrid, {
  parseAmenities,
} from "../../components/property/AmenitiesGrid";
import ConfigurationsTable, {
  parseConfigurations,
} from "../../components/property/ConfigurationsTable";
import InquiryForm from "../../components/forms/InquiryForm";
import SiteVisitForm from "../../components/forms/SiteVisitForm";
import WhatsAppButton, {
  buildWhatsAppHref,
} from "../../components/shared/WhatsAppButton";
import SEOHead from "../../components/shared/SEOHead";
import {
  organizationSchema,
  breadcrumbSchema,
  realEstateListingSchema,
} from "../../lib/seo";
import Skeleton from "../../components/ui/Skeleton";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import { placeholderImage } from "../../demo";
import "./PropertyDetailPage.css";

const LISTING_TYPE_META = {
  buy: { label: "For Sale", modifier: "buy" },
  rent: { label: "For Rent", modifier: "rent" },
  commercial: { label: "Commercial", modifier: "commercial" },
};

// `property_type` is a Postgres text[] column — a property can be more
// than one type at once (e.g. "Residential" + "Apartment"). This renders
// whatever is there as a single display string, and also tolerates a
// plain string in case any caller ever passes legacy/mock data through.
function formatPropertyType(propertyType) {
  if (Array.isArray(propertyType)) {
    return propertyType.filter(Boolean).join(", ") || null;
  }
  return propertyType || null;
}

/**
 * Long-form free-text fields (`about_property`, `about_builder_company`,
 * `about_location`, `explore_neighbourhood`) are entered as a single
 * string with no guaranteed paragraph breaks. In practice several rows
 * (e.g. "Atmos by Solaire") were saved with section labels like
 * "Project Layout:", "Amenities:", "Nearby Landmarks:" run directly
 * into the previous sentence with no space or newline at all, which
 * `white-space: pre-line` can't fix on its own since there's no `\n`
 * to preserve.
 *
 * This is a display-layer patch, not a data fix: it heuristically
 * inserts a paragraph break before anything that looks like a
 * "Label:" section header, and adds a space after any period that's
 * missing one. It won't be 100% perfect on every possible string, but
 * it turns the current garbled paragraphs back into readable sections
 * without needing a DB migration. The underlying `about_property`
 * (etc.) content should still be cleaned up at the source (admin
 * form / import script) going forward.
 */
function formatLongText(text) {
  if (!text) return "";

  let formatted = text;

  // Ensure a space after any period directly glued to the next word
  // (fixes "LLP.Project Layout" -> "LLP. Project Layout").
  formatted = formatted.replace(/\.(?=[A-Za-z0-9])/g, ". ");

  // Insert a paragraph break before short Title-Case "Label:" style
  // section headers (1-4 words, may include "&"), whether or not
  // they were preceded by punctuation.
  formatted = formatted.replace(
    /([.!?]\s+|^)([A-Z][\w'-]*(?:\s(?:&\s)?[\w'-]+){0,3}:)/g,
    (match, sep, label, offset) => (offset === 0 ? label : `\n\n${label}`),
  );

  // Break out a trailing "In short, ..." summary onto its own paragraph.
  formatted = formatted.replace(/\s+(In short,)/g, "\n\n$1");

  return formatted.trim();
}

function PropertyDetailPage() {
  const { id } = useParams();
  const { data: property, isLoading, isError } = useProperty(id);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [showSiteVisitModal, setShowSiteVisitModal] = useState(false);

  if (isLoading) {
    return <PropertyDetailSkeleton />;
  }

  if (isError || !property) {
    return (
      <div className="pdp-error-container">
        <SEOHead title="Property Not Found" noindex />
        <h1>Property Not Found</h1>
        <p>This property may have been removed or is no longer available.</p>
        <Button as={Link} to="/properties">
          Browse Properties
        </Button>
      </div>
    );
  }

  const amenities = parseAmenities(property.amenities);
  const configurations = parseConfigurations(property.floor_space_pricing);
  const { truncated, isLong, fullDesc } = processDescription(property);
  const listingMeta = LISTING_TYPE_META[property.listing_type] || null;
  const identifier = property.slug || property.id;

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Properties", path: "/properties" },
    { name: property.name, path: `/properties/${identifier}` },
  ];

  const whatsappHref = buildWhatsAppHref(
    `Hi, I'm interested in "${property.name}" listed on DreamSpace Properties. Could you share more details?`,
  );

  return (
    <div className="pdp-page">
      <SEOHead
        title={`${property.name}${property.location ? ` — ${property.location}` : ""}`}
        description={property.about_property}
        path={`/properties/${identifier}`}
        image={property.image_url}
        type="product"
        jsonLd={[
          organizationSchema(),
          realEstateListingSchema(property, {
            path: `/properties/${identifier}`,
          }),
          breadcrumbSchema(breadcrumbItems),
        ]}
      />

      <nav className="pdp-breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span aria-hidden="true">›</span>
        <Link to="/properties">Properties</Link>
        <span aria-hidden="true">›</span>
        <span aria-current="page">{property.name}</span>
      </nav>

      {/* Hero */}
      <section className="pdp-hero" aria-label="Property overview">
        <div className="pdp-hero-image-container">
          <img
            src={property.image_url || placeholderImage("Property", 1200, 800)}
            alt={property.name}
            className="pdp-hero-img"
            loading="eager"
            fetchpriority="high"
          />
          <div className="pdp-hero-badges">
            {listingMeta && (
              <span
                className={`pdp-listing-badge pdp-listing-badge--${listingMeta.modifier}`}
              >
                {listingMeta.label}
              </span>
            )}
            {formatPropertyType(property.property_type) && (
              <span className="pdp-property-badge">
                {formatPropertyType(property.property_type)}
              </span>
            )}
          </div>
          {property.google_drive_url && (
            <a
              href={property.google_drive_url}
              target="_blank"
              rel="noopener noreferrer"
              className="pdp-gallery-btn"
              aria-label="View property photo gallery (opens in a new tab)"
            >
              <MdOutlinePhotoLibrary /> View Gallery
            </a>
          )}
        </div>

        <div className="pdp-hero-content">
          <div className="pdp-hero-title-section">
            <h1>{property.name}</h1>
            {property.rera_no && (
              <span
                className="pdp-rera-badge"
                title={`RERA No. ${property.rera_no}`}
              >
                <FaIdCard aria-hidden="true" /> RERA {property.rera_no}
              </span>
            )}
            <p className="pdp-location">
              <MdOutlineLocationOn aria-hidden="true" />
              {property.location || "Location not specified"}
            </p>
          </div>

          <div className="pdp-hero-meta">
            <div className="pdp-hero-highlights">
              {property.bhk && (
                <div className="pdp-highlight-item">
                  <FaBed aria-hidden="true" />
                  <span>{property.bhk}</span>
                </div>
              )}
              {property.carpet_area && (
                <div className="pdp-highlight-item">
                  <FaRuler aria-hidden="true" />
                  <span>{property.carpet_area} sq. yards</span>
                </div>
              )}
              {property.developed_by && (
                <div className="pdp-highlight-item">
                  <FaRegBuilding aria-hidden="true" />
                  <span>{property.developed_by}</span>
                </div>
              )}
            </div>

            <div className="pdp-hero-actions">
              <Button
                as="a"
                href="#pdp-inquiry"
                variant="primary"
                className="pdp-contact-btn"
              >
                Request Price Details
              </Button>
              <WhatsAppButton
                variant="inline"
                message={`Hi, I'm interested in "${property.name}" listed on DreamSpace Properties. Could you share more details?`}
                label="WhatsApp"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <main className="pdp-main-grid">
        <div className="pdp-primary-content">
          <Section title="About" icon={<MdHome />} initialOpen>
            <DescriptionText
              fullDesc={fullDesc}
              truncated={truncated}
              isLong={isLong}
              showFullDesc={showFullDesc}
              toggle={() => setShowFullDesc(!showFullDesc)}
            />
          </Section>

          <Section title="Key Details" icon={<MdCheckCircle />}>
            <QuickInfoGrid property={property} />
          </Section>

          {configurations.length > 0 && (
            <Section
              title="Floor Plans & Pricing"
              icon={<MdOutlineCalendarMonth />}
            >
              <div className="pdp-table-scroll">
                <ConfigurationsTable configurations={configurations} />
              </div>
            </Section>
          )}

          {amenities.length > 0 && (
            <Section title="Amenities & Facilities" icon={<MdFitnessCenter />}>
              <AmenitiesGrid amenities={amenities} />
            </Section>
          )}

          {property.about_builder_company && (
            <Section title="About the Developer" icon={<FaBuilding />}>
              <p className="pdp-developer-info">
                {formatLongText(property.about_builder_company)}
              </p>
            </Section>
          )}

          {property.about_location && (
            <Section title="Location Highlights" icon={<MdOutlineLocationOn />}>
              <p className="pdp-location-info">
                {formatLongText(property.about_location)}
              </p>
            </Section>
          )}

          {property.explore_neighbourhood && (
            <Section
              title="Explore the Neighbourhood"
              icon={<MdOutlineLocationOn />}
            >
              <p className="pdp-location-info">
                {formatLongText(property.explore_neighbourhood)}
              </p>
            </Section>
          )}
        </div>

        <div className="pdp-secondary-content">
          <Section title="Property Overview" variant="card">
            <QuickFacts property={property} />
          </Section>

          {property.google_map_location && (
            <Section
              title="Map Location"
              variant="card"
              icon={<MdOutlineLocationOn />}
            >
              <LocationMap location={property.google_map_location} />
            </Section>
          )}

          <Section
            title="Interested in this Property?"
            variant="card"
            icon={<MdCheckCircle />}
            id="pdp-inquiry"
          >
            <InquiryForm property={property} />
          </Section>

          <Section variant="card">
            <Button
              type="button"
              variant="outline"
              fullWidth
              className="pdp-site-visit-btn"
              onClick={() => setShowSiteVisitModal(true)}
            >
              <MdOutlineCalendarMonth /> Schedule a Site Visit
            </Button>
          </Section>
        </div>
      </main>

      <Modal
        isOpen={showSiteVisitModal}
        onClose={() => setShowSiteVisitModal(false)}
        title="Schedule a Site Visit"
      >
        <SiteVisitForm
          property={property}
          onSuccess={() => setShowSiteVisitModal(false)}
        />
      </Modal>

      <WhatsAppButton
        variant="floating"
        message={`Hi, I'm interested in "${property.name}" listed on DreamSpace Properties. Could you share more details?`}
      />
    </div>
  );
}

// Sub-components
const Section = ({ title, children, variant, initialOpen, icon, id }) => (
  <section
    id={id}
    className={`pdp-section ${variant ? `pdp-section--${variant}` : ""}`}
  >
    {title && (
      <h2 className="pdp-section-title">
        {icon && <span className="pdp-section-icon">{icon}</span>}
        {title}
      </h2>
    )}
    <div className="pdp-section-content">{children}</div>
  </section>
);

const DescriptionText = ({
  fullDesc,
  truncated,
  isLong,
  showFullDesc,
  toggle,
}) => (
  <>
    <div
      className="pdp-description-text"
      aria-expanded={isLong ? showFullDesc : undefined}
    >
      {showFullDesc ? fullDesc : truncated}
    </div>
    {isLong && (
      <button
        className="pdp-toggle-btn"
        onClick={toggle}
        aria-label={`${showFullDesc ? "Collapse" : "Expand"} description`}
      >
        {showFullDesc ? (
          <>
            <MdExpandLess /> Show Less
          </>
        ) : (
          <>
            <MdExpandMore /> Show More
          </>
        )}
      </button>
    )}
  </>
);

const QuickInfoGrid = ({ property }) => (
  <div className="pdp-quick-grid">
    <InfoItem
      icon={<FaBuilding />}
      label="Property Type"
      value={formatPropertyType(property.property_type)}
    />
    <InfoItem icon={<FaBed />} label="BHK Configuration" value={property.bhk} />
    <InfoItem
      icon={<FaRuler />}
      label="Carpet Area"
      value={property.carpet_area ? `${property.carpet_area} sq. yards` : null}
    />
    <InfoItem
      icon={<MdOutlineCalendarToday />}
      label="Possession Date"
      value={
        property.possession
          ? new Date(property.possession).toLocaleDateString("en-UK", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
          : null
      }
    />
    <InfoItem
      icon={<FaBuilding />}
      label="Total Units"
      value={property.no_of_units}
    />
    <InfoItem
      icon={<FaIdCard />}
      label="RERA Number"
      value={property.rera_no}
    />
    <InfoItem
      icon={<FaRegBuilding />}
      label="Developer"
      value={property.developed_by}
    />
    <InfoItem
      icon={<FaRulerCombined />}
      label="Project Area"
      value={property.project_area}
    />
    <InfoItem icon={<FaBuilding />} label="Towers" value={property.towers} />
    <InfoItem icon={<FaBuilding />} label="Floors" value={property.floor} />
    <InfoItem
      icon={<MdOutlineLocationOn />}
      label="View"
      value={property.property_view}
    />
    <InfoItem
      icon={<MdLocalParking />}
      label="Alloted Parking"
      value={property.parking}
    />
  </div>
);

const InfoItem = ({ icon, label, value }) => (
  <div className="pdp-info-item">
    {icon && <span className="pdp-info-icon">{icon}</span>}
    <div className="pdp-info-content">
      <strong>{label}</strong>
      <span>{value || "—"}</span>
    </div>
  </div>
);

const QuickFacts = ({ property }) => (
  <div className="pdp-quick-facts">
    <InfoCard
      icon={<FaBuilding />}
      label="Property Type"
      value={formatPropertyType(property.property_type) || "Coming Soon"}
    />
    <InfoCard
      icon={<FaRulerCombined />}
      label="Total Area"
      value={property.project_area || "Coming Soon"}
    />
    {property.brochure_url && <BrochureDownload url={property.brochure_url} />}
  </div>
);

const InfoCard = ({ icon, label, value }) => (
  <div className="pdp-info-card">
    <div className="pdp-info-card-icon">{icon}</div>
    <div className="pdp-info-card-content">
      <div className="pdp-info-card-label">{label}</div>
      <div className="pdp-info-card-value">{value || "—"}</div>
    </div>
  </div>
);

const LocationMap = () => {
  return (
    <div className="pdp-map-container">
      <div className="pdp-map-iframe" role="img" aria-label="Our Office Location">
        Our Office Location
      </div>
    </div>
  );
};

const BrochureDownload = ({ url }) => (
  <a
    href={url}
    className="pdp-brochure-download"
    target="_blank"
    rel="noopener noreferrer"
    download
  >
    <FaDownload />
    <span>Download Property Brochure</span>
  </a>
);

const PropertyDetailSkeleton = () => (
  <div className="pdp-page">
    <div className="pdp-skeleton-hero">
      <Skeleton variant="rect" height={360} />
    </div>
    <main className="pdp-main-grid">
      <div className="pdp-primary-content">
        <Skeleton variant="text" lines={4} />
        <Skeleton variant="rect" height={160} />
        <Skeleton variant="rect" height={200} />
      </div>
      <div className="pdp-secondary-content">
        <Skeleton variant="rect" height={220} />
        <Skeleton variant="rect" height={260} />
      </div>
    </main>
  </div>
);

const processDescription = (property) => {
  const rawText = property.about_property || "No description available.";
  const fullDesc = formatLongText(rawText);
  const limit = 300;
  const isLong = fullDesc.length > limit;
  const truncated = isLong ? `${fullDesc.slice(0, limit).trim()}…` : fullDesc;
  return { fullDesc, truncated, isLong };
};

export default PropertyDetailPage;
