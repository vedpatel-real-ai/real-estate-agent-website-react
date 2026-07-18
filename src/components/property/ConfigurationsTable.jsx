// src/components/property/ConfigurationsTable.jsx
import React from 'react';
import './ConfigurationsTable.css';

/**
 * ConfigurationsTable (Package 4.3)
 *
 * Extracted from `PropertyDetail.jsx`, where it was defined but never
 * actually rendered anywhere in the component tree (Blueprint gap item
 * #26: "ConfigurationsTable defined but check needed for render path").
 * `PropertyDetailPage.jsx` now renders this whenever `configurations`
 * (parsed from the `floor_space_pricing` JSON column) is non-empty —
 * this also serves as the redesign plan's "Floor plans & pricing table"
 * section, since there is no separate `floor_plan_url` column in the
 * live schema to source a standalone floor-plan section from.
 *
 * Currency fixed from `$` to `₹` (gap item #26) with `en-IN` grouping.
 */
function ConfigurationsTable({ configurations }) {
  if (!configurations || configurations.length === 0) return null;

  const formatPrice = (price) => {
    const numeric = typeof price === 'number' ? price : Number(price);
    if (!Number.isFinite(numeric) || numeric <= 0) return 'Contact for Price';
    return `₹${numeric.toLocaleString('en-IN')}`;
  };

  return (
    <div className="config-table-container">
      <table className="config-table">
        <thead>
          <tr>
            <th>Unit Type</th>
            <th>Area (sq.ft)</th>
            <th>Price Range</th>
          </tr>
        </thead>
        <tbody>
          {configurations.map((cfg, idx) => (
            <tr key={idx}>
              <td>{cfg.type || '—'}</td>
              <td>{cfg.area || '—'}</td>
              <td className="config-table__price-cell">{formatPrice(cfg.price)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function parseConfigurations(raw) {
  try {
    const parsed = JSON.parse(raw || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default ConfigurationsTable;
