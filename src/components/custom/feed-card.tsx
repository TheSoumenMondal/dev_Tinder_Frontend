"use client";

import Image from "next/image";
import React, { useState } from "react";
import { Card, CardFooter } from "../ui/card";
import { IconX } from "@tabler/icons-react";
import HeartIcon from "@/assets/icons/heart";
import { motion } from "framer-motion";
import { User } from "@/types";
import axiosInstance from "@/utils/axios-instance";
import { useFeedStore } from "@/utils/store";
import { connectionApi } from "@/apis/connection-api";

type Props = {
  user: User;
};

const FeedCard = ({ user }: Props) => {
  const [imageError, setImageError] = useState(false);
  const fallbackImage =
    "https://images.pexels.com/photos/9567706/pexels-photo-9567706.jpeg?_gl=1*ksjuoy*_ga*MzQxOTkyMTQyLjE3NTU5NjI4OTE.*_ga_8JE65Q40S6*czE3NTYwNjY1MjAkbzMkZzEkdDE3NTYwNjY1NzYkajQkbDAkaDA.";

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-full">
        <Card className="relative w-full max-w-sm h-[65vh] rounded-lg overflow-hidden flex items-center justify-center select-none">
          <div className="text-center p-6">Loading...</div>
        </Card>
      </div>
    );
  }

  const id = user._id;

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
  const age = user.age ?? 0;

  const { removeUser } = useFeedStore();

  const handleReaction = async (status: "ignored" | "interested") => {
    try {
      const response = await axiosInstance.post(connectionApi.reactToUser, {
        receiverId: id,
        status: status,
      });
      console.log(response.data);
      // Remove the user from feed so next user becomes visible
      removeUser(id);
    } catch (error) {
      console.error("Error reacting to user:", error);
      // optional: toast error
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <Card className="relative w-full max-w-sm h-[65vh] rounded-lg overflow-hidden flex items-center justify-center select-none">
        <Image
          src={imageError ? fallbackImage : avatarUrl}
          alt={fullName}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
            {fullName}, {age}
          </h1>
          <p className="text-sm opacity-90 mb-1">{username}</p>
          <p className="text-sm opacity-90 ">{bioPreview}</p>
        </div>
      </Card>

      <CardFooter className="flex items-center justify-center gap-6 pt-5">
        <motion.button
          onClick={() => handleReaction("ignored")}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1 }}
          className="w-14 h-14 rounded-full flex items-center justify-center border cursor-pointer"
        >
          <IconX className="w-6 h-6" color="red" />
        </motion.button>
        <motion.button
          onClick={() => handleReaction("interested")}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1 }}
          className="w-14 h-14 rounded-full flex items-center justify-center border cursor-pointer"
        >
          <HeartIcon />
        </motion.button>
      </CardFooter>
    </div>
  );
};

export default FeedCard;
