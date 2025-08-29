"use client";

import { connectionApi } from "@/apis/connection-api";
import PreviewRequestCard, {
  PreviewRequestCardProps,
} from "@/components/custom/preview-request-card";
import LoadingSpinner from "@/components/common/loading-spinner";
import axiosInstance from "@/utils/axios-instance";
import React, { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";

const RequestPage = () => {
  const [pendingRequests, setPendingRequests] = useState<
    PreviewRequestCardProps[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  const getPendingRequest = async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
      } else {
        setIsLoading(true);
      }
      const response = await axiosInstance.get(
        connectionApi.getMyRequests
      );
      setPendingRequests(response.data.data || []);
    } catch (error) {
      toast.error("Error fetching pending requests");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPendingRequest();
  }, []);

  const interestedRequests = useMemo(() => {
    return pendingRequests.filter((request) => request.status === "interested");
  }, [pendingRequests]);

  if (isLoading) {
    return (
      <div className="pt-16 w-full h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <LoadingSpinner />
          <p className="text-muted-foreground">Loading your requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 w-full min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {interestedRequests.length === 0 ? (
          <div>
            <div className="flex flex-col items-center justify-center mt-20">
              <h2 className="text-sm font-semibold mb-2">
                No Interested Requests Yet
              </h2>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1">
            {interestedRequests.map((request) => (
              <PreviewRequestCard
                key={`${request._id}-${request.senderId._id}`}
                _id={request._id}
                createAt={request.createAt}
                receiverId={request.receiverId}
                senderId={request.senderId}
                status={request.status}
                onRequestUpdate={getPendingRequest}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestPage;
