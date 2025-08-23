"use client";

import Image from "next/image";
import React from "react";
import { Card, CardFooter } from "../ui/card";
import { IconX } from "@tabler/icons-react";
import HeartIcon from "@/assets/icons/heart";
import { motion } from "framer-motion";

type Props = {};

const FeedCard = (props: Props) => {
  const dummyUser = {
    name: "Tonny Stark",
    avatarUrl:
      "https://images.pexels.com/photos/33516862/pexels-photo-33516862.jpeg?_gl=1*qjk1oy*_ga*MzQxOTkyMTQyLjE3NTU5NjI4OTE.*_ga_8JE65Q40S6*czE3NTU5NjI4OTAkbzEkZzEkdDE3NTU5NjI4OTkkajUxJGwwJGgw",
    id: "1",
    bio: "Just being a developer with a keen mindset of creating something amazing.",
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full">
      <Card className="relative w-full max-w-sm h-[65vh] rounded-lg overflow-hidden flex items-center justify-center select-none">
        <Image
          src={dummyUser.avatarUrl}
          alt={dummyUser.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 className="text-2xl font-bold mb-1">
            {dummyUser.name}, {dummyUser.id + 6}
          </h1>
          <p className="text-sm opacity-90 mb-1">@thesoumen</p>
          <p className="text-sm opacity-90 ">
            {dummyUser.bio.split(" ").length > 15
              ? dummyUser.bio.split(" ").slice(0, 15).join(" ") + "..."
              : dummyUser.bio}
          </p>
        </div>
      </Card>

      <CardFooter className="flex items-center justify-center gap-6 pt-5">
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1 }}
          className="w-14 h-14 rounded-full flex items-center justify-center border cursor-pointer"
        >
          <IconX className="w-6 h-6" color="red" />
        </motion.button>
        <motion.button
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
