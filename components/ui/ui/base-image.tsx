import Image from "next/image";
import type { ImageProps } from "next/image";
import React, {JSX} from "react";

const BaseImage: React.FC<ImageProps> = (props): JSX.Element => {
  const newImageProps = { ...props };

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <Image fill {...newImageProps} />
    </>
  );
};

export default BaseImage;
