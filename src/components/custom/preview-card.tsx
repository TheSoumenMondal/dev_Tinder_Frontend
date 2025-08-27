"use client";

import Image from "next/image";
import React, { useState } from "react";
import { Card } from "../ui/card";
import { User } from "@/types";

type Props = {
  user: User;
};

const PreviewCard = ({ user }: Props) => {
  const [imageError, setImageError] = useState(false);
  const fallbackImage =
    "https://images.pexels.com/photos/9567706/pexels-photo-9567706.jpeg?_gl=1*ksjuoy*_ga*MzQxOTkyMTQyLjE3NTU5NjI4OTE.*_ga_8JE65Q40S6*czE3NTYwNjY1MjAkbzMkZzEkdDE3NTYwNjY1NzYkajQkbDAkaDA.";

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center w-full">
        <Card className="relative w-full max-w-sm h-[65vh] rounded-lg overflow-hidden flex items-center justify-center select-none">
          <div className="text-center p-6">Loading...</div>
        </Card>
      </div>
    );
  }

  const avatarUrl =
    user.avatarUrl && user.avatarUrl.trim() !== ""
      ? user.avatarUrl
      : fallbackImage;
  const fullName =
    `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "Unknown";
  const username = user.email ? `@${user.email.split("@")[0]}` : "@unknown";
  const bioText = user.bio ?? "";
  const bioPreview =
    bioText.split(" ").length > 15
      ? bioText.split(" ").slice(0, 15).join(" ") + "..."
      : bioText;
  const age = typeof user.age === "number" && !isNaN(user.age) ? user.age : 0;

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <Card className="relative w-full max-w-sm h-[65vh] rounded-lg overflow-hidden flex items-center justify-center select-none">
        <Image
          src={imageError ? fallbackImage : avatarUrl}
          alt={fullName}
          fill
          className="object-cover"
          priority
          onError={() => {
            if (!imageError) {
              setImageError(true);
            }
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 className="text-2xl font-bold mb-1">
            {fullName}, {String(age)}
          </h1>
          <p className="text-sm opacity-90 mb-1">{username}</p>
          <p className="text-sm opacity-90">{bioPreview}</p>
        </div>
      </Card>
      
      {/* Preview text instead of interactive buttons */}
      <div className="flex items-center justify-center pt-5">
        <p className="text-sm text-muted-foreground">
          This is how your profile will appear to others
        </p>
      </div>
    </div>
  );
};

export default PreviewCard;
