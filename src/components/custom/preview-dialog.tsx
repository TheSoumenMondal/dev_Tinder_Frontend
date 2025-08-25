"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import PreviewCard from "./preview-card";
import { User } from "@/types";

const PreviewDialog = ({
  buttonStyle,
  user,
}: {
  buttonStyle: string;
  user: User;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className={buttonStyle}>
          Preview
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Preview</DialogTitle>
        </DialogHeader>
        <PreviewCard user={user} />
      </DialogContent>
    </Dialog>
  );
};

export default PreviewDialog;
