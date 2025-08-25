import { User } from "@/types";
import React, { useState } from "react";
import { Card, CardContent, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { connectionApi } from "@/apis/connection-api";
import axiosInstance from "@/utils/axios-instance";
import { toast } from "sonner";
import { Check, X, Heart, Clock } from "lucide-react";

export type PreviewRequestCardProps = {
  _id: string;
  senderId: Partial<User>;
  receiverId: Partial<User>;
  status: "interested" | "ignored" | "accepted" | "rejected";
  createAt: string;
  onRequestUpdate?: () => void;
};

const safeParseTime = (iso: string) => {
  if (!iso || typeof iso !== "string") return null;
  let ts = Date.parse(iso);
  if (!isNaN(ts)) return ts;
  const fixed = iso.replace(/([+-]\d{2}):?(\d{2})$/, "$1$2");
  ts = Date.parse(fixed);
  return isNaN(ts) ? null : ts;
};

const PreviewRequestCard = ({
  _id,
  createAt,
  senderId,
  status,
  onRequestUpdate,
}: PreviewRequestCardProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(status);

  const ts = safeParseTime(createAt);
  const diffMs = ts ? Math.max(0, Date.now() - ts) : 0;

  const getTimeAgo = () => {
    if (diffMs < 60000) return "Just now";
    if (diffMs < 3600000) {
      const minutes = Math.floor(diffMs / 60000);
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    }
    if (diffMs < 86400000) {
      const hours = Math.floor(diffMs / 3600000);
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    }
    if (diffMs < 2592000000) {
      const days = Math.floor(diffMs / 86400000);
      return `${days} ${days === 1 ? "day" : "days"} ago`;
    }
    const months = Math.floor(diffMs / 2592000000);
    return `${months} ${months === 1 ? "month" : "months"} ago`;
  };

  const handleConnectionResponse = async (action: "accepted" | "rejected") => {
    setIsUpdating(true);
    try {
      const response = await axiosInstance.patch(
        `${connectionApi.updateConnectionStatus}/${action}/${_id}`
      );

      console.log(`Request ${action} response:`, response.data);

      setCurrentStatus(action);
      toast.success(`Request ${action} successfully`);

      if (onRequestUpdate) {
        onRequestUpdate();
      }
    } catch (error) {
      toast.error(`Failed to ${action} request`);
      console.error(`Error ${action}ing request:`, error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusDisplay = () => {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
        <Heart className="w-3 h-3" />
        Interested
      </span>
    );
  };

  return (
    <Card className="w-full hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/20">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* User Info Section */}
          <div className="flex items-start space-x-3">
            <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
              <AvatarImage src={senderId.avatarUrl} alt={senderId.firstName} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {senderId.firstName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold truncate">
                  {senderId.firstName} {senderId.lastName}
                </CardTitle>
                {getStatusDisplay()}
              </div>

              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {getTimeAgo()}
              </p>

              {senderId.bio && (
                <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                  {senderId.bio}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons Section */}
          <div className="flex gap-2 pt-2 border-t">
            <Button
              onClick={() => handleConnectionResponse("rejected")}
              disabled={isUpdating}
              variant="outline"
              size="sm"
              className="flex-1 hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-950/20"
            >
              <X className="w-4 h-4 mr-1" />
              Reject
            </Button>

            <Button
              onClick={() => handleConnectionResponse("accepted")}
              disabled={isUpdating}
              size="sm"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              <Check className="w-4 h-4 mr-1" />
              Accept
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PreviewRequestCard;
