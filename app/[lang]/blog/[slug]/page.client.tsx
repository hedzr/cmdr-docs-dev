"use client";
import { Share } from "lucide-react";
import {
  TooltipContent,
  Tooltip,
  TooltipTrigger,
  TooltipProvider,
} from "@radix-ui/react-tooltip";
import React, { useState } from "react";
import { cn } from "@/lib/cn";
// import { buttonVariants } from "@/components/ui/button";
import { buttonVariants1 } from "@/components/ui/button1";

export function Control({ url }: { url: string }): React.ReactElement {
  const [open, setOpen] = useState(false);
  const onClick = (): void => {
    setOpen(true);
    void navigator.clipboard.writeText(`${window.location.origin}${url}`);
  };

  return (
    <TooltipProvider>
      <Tooltip open={open} onOpenChange={setOpen}>
        <TooltipTrigger
          className={cn(
            buttonVariants1({ className: "gap-2", variant: "secondary" })
          )}
          onClick={onClick}
        >
          <Share className="size-4" />
          Share Post
        </TooltipTrigger>
        <TooltipContent className="rounded-lg border bg-fd-popover p-2 text-sm text-fd-popover-foreground">
          Copied
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
