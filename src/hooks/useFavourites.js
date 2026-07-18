// src/hooks/useFavourites.js
//
// New (Auth & Favourites Architecture Plan §6) — Supabase-backed
// favourites for signed-in users, following the same TanStack Query
// convention as useProperties.js/useBlogPosts.js rather than inventing a
// new data-fetching pattern. Guests use useGuestFavourites (localStorage)
// instead; PropertyCard itself doesn't need to know which backend is in
// play — see useFavouriteState.js, which picks the right one.
import { useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

export const favouriteKeys = {
  all: ['favourites'],
  list: (userId) => [...favouriteKeys.all, 'list', userId],
};

/**
 * useFavourites
 *
 * @returns {{
 *   favouriteIds: number[],
 *   isFavourite: (propertyId: number) => boolean,
 *   toggleFavourite: (propertyId: number) => void,
 *   isLoading: boolean,
 * }}
 */
export function useFavourites() {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.id;

  const { data, isLoading } = useQuery({
    queryKey: favouriteKeys.list(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('favourites')
        .select('property_id')
        .eq('user_id', userId);
      if (error) throw error;
      return data.map((row) => row.property_id);
    },
    enabled: isAuthenticated && !!userId,
    staleTime: 60_000,
  });

  const favouriteIds = data ?? [];

  const addMutation = useMutation({
    mutationFn: async (propertyId) => {
      const { error } = await supabase
        .from('favourites')
        .insert({ user_id: userId, property_id: propertyId });
      // 23505 = unique_violation — harmless if a duplicate insert races
      // in (e.g. a double-click), same row already exists either way.
      if (error && error.code !== '23505') throw error;
    },
    onMutate: async (propertyId) => {
      await queryClient.cancelQueries({ queryKey: favouriteKeys.list(userId) });
      const previous = queryClient.getQueryData(favouriteKeys.list(userId));
      queryClient.setQueryData(favouriteKeys.list(userId), (old = []) =>
        old.includes(propertyId) ? old : [...old, propertyId],
      );
      return { previous };
    },
    onError: (_err, _propertyId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(favouriteKeys.list(userId), context.previous);
      }
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: favouriteKeys.list(userId) }),
  });

  const removeMutation = useMutation({
    mutationFn: async (propertyId) => {
      const { error } = await supabase
        .from('favourites')
        .delete()
        .eq('user_id', userId)
        .eq('property_id', propertyId);
      if (error) throw error;
    },
    onMutate: async (propertyId) => {
      await queryClient.cancelQueries({ queryKey: favouriteKeys.list(userId) });
      const previous = queryClient.getQueryData(favouriteKeys.list(userId));
      queryClient.setQueryData(favouriteKeys.list(userId), (old = []) =>
        old.filter((id) => id !== propertyId),
      );
      return { previous };
    },
    onError: (_err, _propertyId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(favouriteKeys.list(userId), context.previous);
      }
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: favouriteKeys.list(userId) }),
  });

  const isFavourite = useCallback(
    (propertyId) => favouriteIds.includes(propertyId),
    [favouriteIds],
  );

  const toggleFavourite = useCallback(
    (propertyId) => {
      if (isFavourite(propertyId)) removeMutation.mutate(propertyId);
      else addMutation.mutate(propertyId);
    },
    [isFavourite, addMutation, removeMutation],
  );

  return { favouriteIds, isFavourite, toggleFavourite, isLoading };
}

/**
 * mergeGuestFavourites
 *
 * Called once, right after a session appears (see usePostAuthRedirect),
 * before the post-login redirect. Bulk-upserts any localStorage-only
 * guest likes into the `favourites` table for the now-known user. Safe
 * to call with an empty array.
 */
export async function mergeGuestFavourites(userId, guestPropertyIds) {
  if (!userId || !guestPropertyIds?.length) return;

  const rows = guestPropertyIds.map((propertyId) => ({
    user_id: userId,
    property_id: propertyId,
  }));

  await supabase
    .from('favourites')
    .upsert(rows, { onConflict: 'user_id,property_id', ignoreDuplicates: true });
}

export default useFavourites;
