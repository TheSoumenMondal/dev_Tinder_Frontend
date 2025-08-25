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

  const { users, setUsers, appendUsers } = useFeedStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const limit = 10;
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const fetchFeedUsers = useCallback(
    async (pageToLoad = 1) => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `${userApi.getFeedData}?page=${pageToLoad}&limit=${limit}`
        );
        const data = response.data.data || [];
        console.log("Fetched feed page", pageToLoad, data);
        if (pageToLoad === 1) {
          setUsers(data);
        } else {
          appendUsers(data);
        }
        return data;
      } catch (error) {
        toast.error("Something went wrong.");
        return [];
      } finally {
        setLoading(false);
      }
    },
    [appendUsers, setUsers]
  );

  useEffect(() => {
    // load first page
    fetchFeedUsers(1);
  }, [fetchFeedUsers]);

  // Auto load next page when sentinel becomes visible or when users is empty
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(async (entry) => {
          if (entry.isIntersecting) {
            const nextPage = page + 1;
            const data = await fetchFeedUsers(nextPage);
            if (data.length > 0) {
              setPage(nextPage);
            }
          }
        });
      },
      { root: null, rootMargin: "200px", threshold: 0.1 }
    );

    const el = sentinelRef.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
      observer.disconnect();
    };
  }, [fetchFeedUsers, page]);

  // Fallback: when the local users list is nearly exhausted (e.g. after reacting and removing items),
  // proactively fetch the next page. This handles cases where the sentinel is already intersecting
  // and doesn't emit another intersection change.
  useEffect(() => {
    const shouldFetchNext = users.length <= 1 && !loading;
    if (!shouldFetchNext) return;

    let cancelled = false;
    (async () => {
      const nextPage = page + 1;
      const data = await fetchFeedUsers(nextPage);
      if (cancelled) return;
      if (data.length > 0) {
        setPage(nextPage);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [users.length, loading, page, fetchFeedUsers]);

  if (isLoading || loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="w-full h-screen flex items-center justify-center">
      {users.length > 0 ? <FeedCard user={users[0]} /> : "No user found."}
      {/* sentinel element observed by IntersectionObserver to auto-load next page */}
      <div
        ref={sentinelRef}
        aria-hidden="true"
        style={{ width: 1, height: 1 }}
      />
    </div>
  );
};

export default FeedPage;
