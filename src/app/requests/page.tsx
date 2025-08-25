"use client";

import { connectionApi } from "@/apis/connection-api";
import PreviewRequestCard, {
  PreviewRequestCardProps,
} from "@/components/custom/preview-request-card";
import LoadingSpinner from "@/components/common/loading-spinner";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/utils/axios-instance";
import React, { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import { RefreshCw, Users, Heart } from "lucide-react";

const RequestPage = () => {
  const [pendingRequests, setPendingRequests] = useState<
    PreviewRequestCardProps[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const getPendingRequest = async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const response = await axiosInstance.get(
        connectionApi.getUserConnections
      );
      console.log("Pending Requests:", response.data);
      setPendingRequests(response.data.data || []);
    } catch (error) {
      toast.error("Error fetching pending requests");
      console.error("Error fetching pending requests:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    getPendingRequest(true);
  };

  useEffect(() => {
    getPendingRequest();
  }, []);

  // Filter only interested requests
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
        {/* Header Section */}
        <div className="flex flex-col space-y-6 mb-8">
          {/* Stats */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-primary" />
              <span className="font-medium">
                {interestedRequests.length}{" "}
                {interestedRequests.length === 1 ? "person is" : "people are"}{" "}
                interested in connecting
              </span>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {interestedRequests.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <Heart className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              No connection requests
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              You don't have any pending connection requests yet. Your requests
              will appear here when someone shows interest in connecting with
              you.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
