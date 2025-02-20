"use client";

import {useEffect} from "react";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function HandlingKeyboardLeftAndRight({ dummy }: { dummy?: string }) {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "ArrowRight") {
                event.preventDefault();
                console.log('onKeyDown, right');
                document.body.querySelector("a > div > svg.lucide-chevron-right")?.parentElement?.parentElement?.click();
            } else if (event.key === "ArrowLeft") {
                event.preventDefault();
                console.log('onKeyDown, left');
                document.body.querySelector("a > div > svg.lucide-chevron-left")?.parentElement?.parentElement?.click();
            }
        };
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <></>
    );
}
