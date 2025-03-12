import type { ReactNode } from "react";
import { ImageZoom } from "fumadocs-ui/components/image-zoom";
import BannerImage from "@/public/images/banner.webp";

export default function Preview(): ReactNode {
  return (
    <ImageZoom
      alt="banner"
      src={BannerImage}
      className="!my-0 rounded-xl bg-fd-background"
      priority
    />
  );
}
