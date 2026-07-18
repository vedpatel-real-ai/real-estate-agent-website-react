// src/hooks/useProperty.js
import { useQuery } from '@tanstack/react-query';
import { demoProperties } from '../demo';
import { isDemoMode, supabase } from '../lib/supabaseClient';
import { propertyKeys } from './useProperties';

const isNumericId = (value) => /^\d+$/.test(String(value ?? '').trim());

/**
 * fetchPropertyByIdentifier
 *
 * Looks up a single property by `slug` first (the new URL scheme,
 * Redesign Plan / Blueprint gap item #26), falling back to the legacy
 * numeric `id` lookup so pre-existing `/properties/:id` links (internal
 * bookmarks, indexed search results) keep resolving after 4.3 switches
 * routing to slugs. 2.1's migration backfilled a unique `slug` for all
 * 51 existing rows, so the slug lookup is expected to succeed for every
 * current property; the id fallback exists purely for old links.
 */
export async function fetchPropertyByIdentifier(identifier) {
  if (!identifier) {
    throw new Error('A property slug or id is required.');
  }

  const trimmed = String(identifier).trim();

  const demoProperty = demoProperties.find(
    (property) => property.slug === trimmed || String(property.id) === trimmed,
  );
  if (isDemoMode && demoProperty) return demoProperty;

  const { data: bySlug, error: slugError } = await supabase
    .from('properties')
    .select('*')
    .eq('slug', trimmed)
    .maybeSingle();
  if (slugError) {
    if (demoProperty) return demoProperty;
    throw slugError;
  }
  if (bySlug) return bySlug;

  if (isNumericId(trimmed)) {
    const { data: byId, error: idError } = await supabase
      .from('properties')
      .select('*')
      .eq('id', Number(trimmed))
      .maybeSingle();
    if (idError) {
      if (demoProperty) return demoProperty;
      throw idError;
    }
    if (byId) return byId;
  }

  if (demoProperty) return demoProperty;
  throw new Error('Property not found.');
}

/**
 * @param {string|number} identifier - a property `slug` or legacy numeric `id`
 * @param {import('@tanstack/react-query').UseQueryOptions} [options]
 */
export function useProperty(identifier, options = {}) {
  return useQuery({
    queryKey: propertyKeys.detail(identifier),
    queryFn: () => fetchPropertyByIdentifier(identifier),
    enabled: Boolean(identifier) && options.enabled !== false,
    staleTime: 60_000,
    ...options,
  });
}

export default useProperty;
