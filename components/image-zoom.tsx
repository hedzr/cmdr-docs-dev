"use client";

import Image, { type ImageProps } from "next/image";
import { type ImgHTMLAttributes } from "react";
import "./image-zoom.css";
import Zoom, { type UncontrolledProps } from "react-medium-image-zoom";
import { useEffect, useState } from "react";
import spot from "@/public/spot.png";
import {
  StaticImport,
  StaticRequire,
  StaticImageData,
} from "next/dist/shared/lib/get-img-props";

// Define the component's props with some restrictions on ImageProps
export interface SafeImageProps extends Omit<ImageProps, "src" | "width" | "height"> {
  src: string | StaticImport; // Primary image source
  fallbackSrc?: string; // Default image source (optional)
  alt: string; // Alt text for accessibility
  width?: number; // Optional width for the image
  height?: number; // Optional height for the image
}

export const SafeImage = ({
  src, // Primary image source
  fallbackSrc = "/spot.png", // Default fallback image
  alt = "Image", // Default alt text
  width = spot.width,
  height = spot.height,
  ...rest // Spread other props like className or priority
}: SafeImageProps) => {
  const [validSrc, setValidSrc] = useState(fallbackSrc); // State to track the valid image source

  // Run validation whenever the src changes
  useEffect(() => {
    checkImage(src); // Check and set the appropriate image source
  }, [src]);

  /**
     Validates the provided src and sets validSrc.
     Adds a leading slash for relative paths.
     Accepts HTTPS/HTTP links as-is.
   */
  const checkImage = (src: string | StaticImport) => {
    if (typeof src === "string") {
      if (!src.startsWith("https") && !src.startsWith("http")) {
        setValidSrc(src.startsWith("/") ? src : "/" + src); // Ensure valid relative path
        return;
      }
      setValidSrc(src); // Use the absolute URL as-is
    } else {
      setValidSrc(src.default.src || src.src || "");
    }
  };
  return (
    <Image
      src={validSrc} // The current valid source
      loader={() => validSrc} // Custom loader for manual source
      alt={alt} // Alt text for the image
      onError={() => setValidSrc(fallbackSrc)} // Handle errors and fallback to default image
      width={width} // Pass width if provided
      height={height} // Pass height if provided
      {...rest} // Spread additional props like className or priority
    />
  );
};

export type ImageZoomProps = ImageProps & {
  /**
   * Image props when zoom in
   */
  zoomInProps?: ImgHTMLAttributes<HTMLImageElement>;

  /**
   * Props for `react-medium-image-zoom`
   */
  rmiz?: UncontrolledProps;
};

function getImageSrc(src: ImageProps["src"]): string {
  if (typeof src === "string") return src;
  if ("default" in src) return src.default.src;
  return src.src;
}

export function ImageZoom({
  zoomInProps,
  children,
  rmiz,
  ...props
}: ImageZoomProps) {
  const src = getImageSrc(props.src);
  return (
    <Zoom
      zoomMargin={20}
      wrapElement="span"
      {...rmiz}
      zoomImg={{
        src: src,
        sizes: undefined,
        ...zoomInProps,
      }}
    >
      {children ?? (
        <SafeImage
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 900px"
          {...props}
        />
      )}
    </Zoom>
  );
}
