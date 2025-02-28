"use client";

import { useEffect } from "react";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function HandlingKeyboardLeftAndRight({
  dummy,
}: {
  dummy?: string;
}) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.shiftKey || event.ctrlKey || event.altKey) return;

      if (event.key === "ArrowUp" && event.metaKey) {
        const q = document.body;
        const e = q.querySelector("a > span.back"); // click `back to list` button
        if (e) {
          event.preventDefault();
          e.parentElement?.click();
        }
        return;
      }

      if (event.metaKey) return;

      if (event.key === "ArrowRight") {
        event.preventDefault();
        console.log("onKeyDown, right");
        const q = document.body;
        const e = q.querySelector("a > div > svg.lucide-chevron-right");
        if (e) e.parentElement?.parentElement?.click();
        else {
          const el = q.querySelector(
            "ul.pagination > li.next:not(disabled) > a"
          );
          if (el) {
            // @ts-ignore
            el.click();
          } else {
            const el = q.querySelector(".next.right > a");
            if (el) {
              // @ts-ignore
              el.click();
            }
          }
        }
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        console.log("onKeyDown, left");
        const q = document.body;
        const e = q.querySelector("a > div > svg.lucide-chevron-left");
        if (e) e.parentElement?.parentElement?.click();
        else {
          const el = q.querySelector(
            "ul.pagination > li.previous:not(disabled) > a"
          );
          if (el) {
            // @ts-ignore
            el.click();
          } else {
            const el = q.querySelector(".prev.left > a");
            if (el) {
              // @ts-ignore
              el.click();
            }
          }
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return <></>;
}
