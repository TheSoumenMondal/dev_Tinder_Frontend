"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconSend2 } from "@tabler/icons-react";
import React, { useState } from "react";

const Page = () => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;
    setMessage("");
  };

  return (
    <div className="pt-20 max-w-4xl mx-auto px-4 relative h-screen flex items-center justify-center">
      <div className="w-full flex gap-2 absolute bottom-4">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <Button
          className="rounded-md flex items-center gap-2"
          size="sm"
          onClick={handleSend}
        >
          Send <IconSend2 size={16} />
        </Button>
      </div>
    </div>
  );
};

export default Page;
