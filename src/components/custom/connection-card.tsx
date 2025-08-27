"use client";

import { connectionType } from "@/types";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { IconMessage } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

type Props = {
  data: connectionType;
};

const ConnectionCard = ({ data }: Props) => {
  const router = useRouter();
  const other = data.senderId || data.receiverId;
  const name =
    `${other?.firstName ?? ""} ${other?.lastName ?? ""}`.trim() || "Unknown";
  const initials = (other?.firstName?.charAt(0) ?? "U").toUpperCase();

  const handleClick = () => {
    router.replace(`/chat/${data._id}`);
  };

  return (
    <div className="w-full flex items-center gap-4 p-4 border rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200">
      <div className="flex-shrink-0">
        <Avatar className="w-12 h-12">
          <AvatarImage src={other?.avatarUrl ?? ""} alt={name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex-1">
        <div className="font-semibold">{name}</div>
        <div className="text-sm text-muted-foreground">{data.status}</div>
      </div>
      <div className="text-xs text-muted-foreground">
        {new Date(data.createdAt).toLocaleString()}
      </div>
      <Button
        onClick={handleClick}
        size={"sm"}
        className="rounded-lg text-xs cursor-pointer"
      >
        Chat
        <IconMessage />
      </Button>
    </div>
  );
};

export default ConnectionCard;
