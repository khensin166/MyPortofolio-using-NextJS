"use client";

import clsx from "clsx";
import NextImage, { ImageProps as NextImageProps } from "next/image";
import { useState } from "react";

interface ImageProps extends NextImageProps {
  rounded?: string;
}

const Image = (props: ImageProps) => {
  const { alt, src, className, rounded, ...rest } = props;
  const [isLoading, setLoading] = useState(true);

  return (
    <div
      className={clsx(
        "relative overflow-hidden",
        isLoading ? "animate-pulse bg-neutral-200 dark:bg-neutral-800" : "",
        rounded,
      )}
    >
      <NextImage
        className={clsx(
          "duration-700 ease-in-out",
          isLoading
            ? "scale-[1.02] blur-xl grayscale"
            : "scale-100 blur-0 grayscale-0",
          rounded,
          className,
        )}
        src={src}
        alt={alt}
        loading={rest.priority ? undefined : "lazy"}
        quality={75}
        unoptimized
        referrerPolicy="no-referrer"
        onLoad={() => setLoading(false)}
        onError={() => setLoading(false)}
        {...rest}
      />
    </div>
  );
};

export default Image;
