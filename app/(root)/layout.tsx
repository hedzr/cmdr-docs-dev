import type { ReactNode } from "react";
import "../global.css";
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
