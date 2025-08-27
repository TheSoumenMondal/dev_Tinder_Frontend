import { User } from "@/types";
import React, { useState } from "react";
// using plain divs instead of Card component per UX request
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

  const getStatusDisplay = () => (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
      <Heart className="w-3 h-3" /> Interested
    </span>
  );

  return (
    <div className="w-full max-w-2xl mx-auto my-2 flex items-center gap-4 px-4 py-2 rounded-lg border shadow-sm bg-background">
      <Avatar className="h-10 w-10 border-2 border-background rounded-full overflow-hidden">
        <AvatarImage
          src={senderId.avatarUrl}
          alt={senderId.firstName}
          className="w-10 h-10 object-cover rounded-full"
        />
        <AvatarFallback className="bg-primary/10 text-primary font-semibold rounded-full">
          {senderId.firstName?.charAt(0) || "U"}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 w-full">
          <span className="font-semibold text-base truncate">
            {senderId.firstName} {senderId.lastName}
          </span>
          {getStatusDisplay()}

          <span className="hidden text-xs text-muted-foreground whitespace-nowrap md:flex items-center gap-1 ml-2">
            <Clock className="w-3 h-3" /> {getTimeAgo()}
          </span>

          <span className="text-xs text-muted-foreground truncate ml-2">
            {senderId.bio ? `— ${senderId.bio}` : ""}
          </span>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          onClick={() => handleConnectionResponse("rejected")}
          disabled={isUpdating}
          variant="outline"
          size="sm"
          className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-950/20"
        >
          <X className="w-4 h-4 mr-1" />
        </Button>
        <Button
          onClick={() => handleConnectionResponse("accepted")}
          disabled={isUpdating}
          size="sm"
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Check className="w-4 h-4 mr-1" />
        </Button>
      </div>
    </div>
  );
};

export default PreviewRequestCard;
