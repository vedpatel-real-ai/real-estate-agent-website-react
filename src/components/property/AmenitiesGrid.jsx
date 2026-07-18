// src/components/property/AmenitiesGrid.jsx
import React from 'react';
import {
  MdCheckCircle,
  MdPool,
  MdWifi,
  MdLocalParking,
  MdSecurity,
  MdFitnessCenter,
  MdElevator,
  MdOutlinePets,
  MdLocalDining,
  MdOutlineSportsSoccer,
  MdLocalLaundryService,
  MdAir,
  MdFireExtinguisher,
} from 'react-icons/md';
import {
  FaTree,
  FaUtensils,
  FaCogs,
  FaBolt,
  FaPlay,
  FaBicycle,
  FaDoorOpen,
  FaBed,
} from 'react-icons/fa';
import { GiPathDistance, GiHomeGarage, GiFireplace, GiTennisCourt } from 'react-icons/gi';
import './AmenitiesGrid.css';

/**
 * AmenitiesGrid (Package 4.3)
 *
 * Extracted from `PropertyDetail.jsx` (Blueprint Section 10, gap item
 * #26's own note: "amenityIconMap/getAmenityIcon... a clean, genuinely
 * reusable little utility, currently trapped as a local constant inside
 * one component file"). Moved as-is into its own component under
 * `components/property/` rather than rewritten, since the icon-matching
 * logic itself was already correct — only its location was the problem.
 */

const amenityIconMap = [
  { keywords: ['pool', 'swim'], icon: <MdPool /> },
  { keywords: ['wifi', 'internet'], icon: <MdWifi /> },
  { keywords: ['parking', 'garage'], icon: <MdLocalParking /> },
  { keywords: ['security', 'guard'], icon: <MdSecurity /> },
  { keywords: ['gym', 'fitness', 'workout'], icon: <MdFitnessCenter /> },
  { keywords: ['elevator', 'lift'], icon: <MdElevator /> },
  { keywords: ['garden', 'park', 'tree'], icon: <FaTree /> },
  { keywords: ['clubhouse'], icon: <FaUtensils /> },
  { keywords: ['maintenance'], icon: <FaCogs /> },
  { keywords: ['power backup', 'electricity'], icon: <FaBolt /> },
  { keywords: ['pet', 'animal'], icon: <MdOutlinePets /> },
  { keywords: ['restaurant', 'dining'], icon: <MdLocalDining /> },
  { keywords: ['sports', 'soccer', 'cricket'], icon: <MdOutlineSportsSoccer /> },
  { keywords: ['laundry'], icon: <MdLocalLaundryService /> },
  { keywords: ['ac', 'air condition'], icon: <MdAir /> },
  { keywords: ['fire', 'extinguisher'], icon: <MdFireExtinguisher /> },
  { keywords: ['bicycle', 'cycling'], icon: <FaBicycle /> },
  { keywords: ['play', 'playground'], icon: <FaPlay /> },
  { keywords: ['tennis'], icon: <GiTennisCourt /> },
  { keywords: ['path', 'distance'], icon: <GiPathDistance /> },
  { keywords: ['open area'], icon: <FaDoorOpen /> },
  { keywords: ['bedroom'], icon: <FaBed /> },
  { keywords: ['garage'], icon: <GiHomeGarage /> },
  { keywords: ['fireplace'], icon: <GiFireplace /> },
];

export const getAmenityIcon = (name) => {
  const lowerName = String(name).toLowerCase();
  for (const { keywords, icon } of amenityIconMap) {
    if (keywords.some((kw) => lowerName.includes(kw))) return icon;
  }
  return <MdCheckCircle />;
};

/**
 * Parses the `properties.amenities` column into a clean string array.
 * The column has been observed as a JSON-stringified array, a plain
 * comma-separated string, or already an array — this normalizes all
 * three, same logic as the original `processPropertyData` helper.
 */
export function parseAmenities(raw) {
  let value = raw;
  try {
    if (typeof value === 'string') {
      try {
        value = JSON.parse(value);
      } catch {
        value = value.split(',').map((item) => item.trim());
      }
    }
    if (!Array.isArray(value)) return [];
    return value
      .map((item) => {
        let s = String(item).trim();
        if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
          s = s.slice(1, -1);
        }
        s = s.replace(/[[\]\\]/g, '').replace(/"/g, '');
        return s.trim();
      })
      .filter(Boolean);
  } catch {
    return [];
  }
}

function AmenitiesGrid({ amenities }) {
  if (!amenities || amenities.length === 0) return null;

  return (
    <div className="amenities-grid">
      {amenities.map((name, i) => (
        <div className="amenities-grid__item" key={`${name}-${i}`}>
          <span className="amenities-grid__icon" aria-hidden="true">
            {getAmenityIcon(name)}
          </span>
          <span className="amenities-grid__label">{name}</span>
        </div>
      ))}
    </div>
  );
}

export default AmenitiesGrid;
