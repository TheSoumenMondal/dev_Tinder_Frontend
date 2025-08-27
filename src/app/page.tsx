import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="max-w-4xl mx-auto min-h-screen  flex items-center justify-center">
      <div className="flex flex-col max-w-md items-center">
        <h1 className="text-4xl font-extrabold text-pink-600 mb-4 drop-shadow-lg text-center">
          Welcome to devTinder
        </h1>
        <p className="text-sm mb-8 text-center">
          Connect, collaborate, and build amazing projects with developers
          around the world. Find your perfect coding match and start creating
          together!
        </p>
        <Link href="/auth/sign-up">
          <Button className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-8 shadow-lg transition-all duration-200">
            Get Started
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default page;
