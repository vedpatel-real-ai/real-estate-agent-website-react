// src/components/PropertyCard.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import {
  MapPin,
  BedDouble,
  Ruler,
  Building2,
  Heart,
  ShieldCheck,
  Star,
  UserRound,
} from "lucide-react";
import { buildWhatsAppHref } from "./shared/WhatsAppButton";
import Skeleton from "./ui/Skeleton";
import { useFavouriteState } from "../hooks/useFavouriteState";
import "./PropertyCard.css";

/**
 * PropertyCard (Package 4.2)
 *
 * Rebuilt per Blueprint Section 10, gap item #25: fixed-height image with a
 * loading skeleton, a listing-type badge (gold/teal/indigo per the
 * redesign plan's Buy/Rent/Commercial scheme), a RERA badge when
 * `rera_no` is present, price display driven by `price_type` (2.1's
 * 'exact' | 'starting_from' | 'on_request'), a WhatsApp quick-contact
 * icon (reusing 4.1's `buildWhatsAppHref`/`WHATSAPP_NUMBER` rather than
 * re-declaring the number here), and a heart/save icon.
 *
 * Consumed by both HomePage (4.1, `property={...}` only) and Properties
 * (4.2, full prop set) — the component must render sensibly whether or
 * not `isFavourite`/`onToggleFavourite`/`viewMode` are supplied, since
 * HomePage only ever passes `property`.
 *
 * Favourites are session-only, client-side state (no `favourites` table
 * exists in the schema per Part A Section 7) — same behaviour as the
 * pre-4.2 `favourites` array in `Properties.jsx`, just actually wired up
 * now, matching the redesign plan's "Heart/save icon" spec for the
 * listing page. `isFavourite`/`onToggleFavourite` are optional; if the
 * parent doesn't supply them the heart still renders and toggles its own
 * local visual state, it just won't persist across a re-mount.
 */

const LISTING_TYPE_META = {
  buy: { label: "For Sale", modifier: "buy" },
  rent: { label: "For Rent", modifier: "rent" },
  commercial: { label: "Commercial", modifier: "commercial" },
};

function formatBhk(property) {
  const min = property.bhk_min;
  const max = property.bhk_max;
  if (min != null && max != null) {
    return min === max ? `${min} BHK` : `${min}-${max} BHK`;
  }
  if (property.bhk) return `${property.bhk} BHK`;
  return null;
}

function formatPrice(property) {
  const priceType =
    property.price_type || (property.price ? "exact" : "on_request");
  const price =
    typeof property.price === "number"
      ? property.price
      : Number(property.price);
  const hasPrice = Number.isFinite(price) && price > 0;

  if (priceType === "on_request" || !hasPrice) {
    return { label: "Price on Request", showPerSqft: false };
  }
  const formatted = `₹${price.toLocaleString("en-IN")}`;
  if (priceType === "starting_from") {
    return { label: `Starting from ${formatted}`, showPerSqft: false };
  }
  return { label: formatted, showPerSqft: true };
}

function isFeaturedProperty(value) {
  return value === true || value === 1 || value === "true" || value === "1";
}

const PropertyCard = ({
  property,
  isFavourite,
  onToggleFavourite,
  viewMode = "grid",
  showWhatsApp = true,
  showListingBadgeWhenFeatured = true,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [localFavourite, setLocalFavourite] = useState(false);
  const favouriteState = useFavouriteState();

  const title = property.title || property.name;
  const image = property.image || property.image_url;
  // `property_type` is a Postgres text[] column, so a property can carry
  // more than one type (e.g. "Residential" + "Apartment"). Fall back to
  // treating a bare string as a single-item list for safety, in case any
  // caller ever passes mock/legacy data through.
  const propertyTypeList = Array.isArray(property.property_type)
    ? property.property_type.filter(Boolean)
    : property.property_type
      ? [property.property_type]
      : [];
  const propertyType = propertyTypeList.length
    ? propertyTypeList.join(" • ")
    : "Residential";
  const listingMeta = LISTING_TYPE_META[property.listing_type] || null;
  const bhkLabel = formatBhk(property);
  const { label: priceLabel, showPerSqft } = formatPrice(property);
  const fallbackFavourite = favouriteState.isFavourite?.(property.id);
  const favourite = onToggleFavourite
    ? Boolean(isFavourite)
    : (fallbackFavourite ?? localFavourite);
  const isFeatured = isFeaturedProperty(property.is_featured);

  const handleToggleFavourite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleFavourite) {
      onToggleFavourite();
    } else {
      const nextValue = !(fallbackFavourite ?? localFavourite);
      setLocalFavourite(nextValue);
      favouriteState.toggleFavourite?.(property.id);
    }
  };

  const whatsappHref = buildWhatsAppHref(
    `Hi, I'm interested in "${title}" listed on DreamSpace Properties. Could you share more details?`,
  );

  const handleWhatsAppClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className={`property-card ${viewMode === "list" ? "property-card--list" : ""}`}
    >
      <Link
        to={`/properties/${property.id}`}
        className={`property-card-link ${viewMode === "list" ? "property-card-link--list" : ""}`}
      >
        <div className="card-image">
          {!imageLoaded && (
            <Skeleton variant="rect" className="card-image-skeleton" />
          )}
          <img
            src={image}
            alt={title}
            className={`property-image ${imageLoaded ? "is-loaded" : ""}`}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />

          {listingMeta && (!isFeatured || showListingBadgeWhenFeatured) && (
            <span
              className={`property-listing-badge property-listing-badge--${listingMeta.modifier}`}
            >
              {listingMeta.label}
            </span>
          )}

          {isFeatured && (
            <span className="property-featured-badge">
              <Star size={12} strokeWidth={2.5} />
              Featured
            </span>
          )}

          <div className="property-type">
            <Building2 className="type-icon" size={16} />
            <span>{propertyType}</span>
          </div>
        </div>

        <div className="property-details">
          <div className="property-title-row">
            <h3 className="property-title">{title}</h3>
            {property.rera_no && (
              <span
                className="property-rera-badge"
                title={`RERA No. ${property.rera_no}`}
              >
                <ShieldCheck size={12} />
                RERA
              </span>
            )}
          </div>

          {property.location && (
            <div className="property-location">
              <MapPin className="icon" size={16} />
              <span>{property.location}</span>
            </div>
          )}

          <div className="property-meta">
            {bhkLabel && (
              <div className="meta-item">
                <BedDouble className="meta-icon" size={18} />
                <span>{bhkLabel}</span>
              </div>
            )}
            {property.carpet_area && (
              <div className="meta-item">
                <Ruler className="meta-icon" size={18} />
                <span>{property.carpet_area} sq.yard</span>
              </div>
            )}
            {property.developed_by && (
              <div
                className="meta-item meta-item--developer"
                title={`Developed by ${property.developed_by}`}
              >
                <UserRound className="meta-icon" size={18} />
                <span>{property.developed_by}</span>
              </div>
            )}
          </div>

          <div className="property-price">
            <span className="price">{priceLabel}</span>
            {showPerSqft && property.price_per_sqft && (
              <span className="price-per">
                {" "}
                (₹{property.price_per_sqft}/sq.ft)
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="card-quick-actions">
        <button
          type="button"
          className={`quick-action-btn quick-action-btn--favourite ${favourite ? "is-active" : ""}`}
          onClick={handleToggleFavourite}
          aria-pressed={favourite}
          aria-label={
            favourite ? "Remove from saved properties" : "Save property"
          }
        >
          <Heart size={16} fill={favourite ? "currentColor" : "none"} />
        </button>
        {showWhatsApp && (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="quick-action-btn quick-action-btn--whatsapp"
            onClick={handleWhatsAppClick}
            aria-label={`Ask about ${title} on WhatsApp (opens in a new tab)`}
          >
            <FaWhatsapp />
          </a>
        )}
      </div>
    </div>
  );
};

export default PropertyCard;
