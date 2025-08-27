"use client";

import { useRequireAuth } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/common/loading-spinner";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useFeedStore } from "@/utils/store";
import { toast } from "sonner";
import axiosInstance from "@/utils/axios-instance";
import { userApi } from "@/apis/user-api";
import FeedCard from "@/components/custom/feed-card";

const FeedPage = () => {
  const { user, isLoading } = useRequireAuth();

  const { users, setUsers, appendUsers, clearUsers } = useFeedStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [initialized, setInitialized] = useState<boolean>(false);
  const fetchingRef = useRef<boolean>(false);
  const limit = 10;
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const fetchFeedUsers = useCallback(
    async (pageToLoad = 1) => {
      // Prevent duplicate requests
      if (fetchingRef.current) {
        return [];
      }

      try {
        fetchingRef.current = true;
        setLoading(true);

        const response = await axiosInstance.get(
          `${userApi.getFeedData}?page=${pageToLoad}&limit=${limit}`
        );
        const data = response.data.data || [];

        if (pageToLoad === 1) {
          setUsers(data);
          setPage(1);
        } else {
          appendUsers(data);
          setPage(pageToLoad);
        }

        if (data.length < limit) {
          setHasMore(false);
        }

        return data;
      } catch (error) {
        console.error("Error fetching feed:", error);
        toast.error("Something went wrong.");
        return [];
      } finally {
        setLoading(false);
        fetchingRef.current = false;
      }
    },
    [appendUsers, setUsers, limit]
  );

  // Initialize feed data only once per user
  useEffect(() => {
    if (!initialized && !isLoading && user) {
      setInitialized(true);
      clearUsers(); // Clear any stale data
      fetchFeedUsers(1);
    }
  }, [initialized, isLoading, user?._id, fetchFeedUsers, clearUsers]);

  // Reset state when user changes
  useEffect(() => {
    return () => {
      if (user) {
        setInitialized(false);
        setPage(1);
        setHasMore(true);
        fetchingRef.current = false;
      }
    };
  }, [user?._id]);

  // Auto load next page when sentinel becomes visible - only when needed
  useEffect(() => {
    if (!hasMore || loading || !initialized || fetchingRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(async (entry) => {
          if (entry.isIntersecting && !fetchingRef.current && hasMore) {
            const nextPage = page + 1;
            await fetchFeedUsers(nextPage);
          }
        });
      },
      { root: null, rootMargin: "200px", threshold: 0.1 }
    );

    const el = sentinelRef.current;
    if (el && hasMore) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
      observer.disconnect();
    };
  }, [hasMore, loading, initialized, page]);

  // Fallback: when the local users list is nearly exhausted - debounced
  useEffect(() => {
    if (!hasMore || loading || !initialized || fetchingRef.current) return;

    const shouldFetchNext = users.length <= 1;
    if (shouldFetchNext) {
      const timeoutId = setTimeout(() => {
        if (!fetchingRef.current && hasMore) {
          const nextPage = page + 1;
          fetchFeedUsers(nextPage);
        }
      }, 100); // Small debounce

      return () => clearTimeout(timeoutId);
    }
  }, [users.length, hasMore, loading, initialized, page]);

  if (isLoading || loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="w-full h-screen flex items-center justify-center">
      {users.length > 0 ? <FeedCard user={users[0]} /> : "No user found."}
      <div
        ref={sentinelRef}
        aria-hidden="true"
        style={{ width: 1, height: 1 }}
      />
    </div>
  );
};

export default FeedPage;
