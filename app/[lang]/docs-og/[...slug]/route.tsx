import { generateOGImage } from "fumadocs-ui/og";
import { site, metadataImage } from "@/lib/metadata";

export const GET = metadataImage.createAPI((page) => {
  return generateOGImage({
    title: page.data.title,
    description: page.data.description,
    icon: page.data.icon,
    site: site.title,

    // fonts: [
    //   {
    //     name: "Roboto",
    //     // Use `fs` (Node.js only) or `fetch` to read the font as Buffer/ArrayBuffer and provide `data` here.
    //     data: robotoArrayBuffer,
    //     weight: 400,
    //     style: "normal",
    //   },
    // ],
  });
});

export function generateStaticParams() {
  return metadataImage.generateParams();
}
