import React from "react";
import { cn } from "../../utils/cn";

export const MacbookScroll = ({
  src,
  showGradient,
  title,
  badge,
}: {
  src?: string;
  showGradient?: boolean;
  title?: string | React.ReactNode;
  badge?: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col items-center justify-start py-8">
      <h2 className="mb-8 text-center text-2xl font-bold text-neutral-800 dark:text-white">
        {title || "Macbook View"}
      </h2>
      <div className="relative h-[20rem] w-[30rem] rounded-2xl bg-[#010101] p-2 border border-glass-border">
        {src && (
          <img
            src={src}
            alt="macbook content"
            className="h-full w-full rounded-lg object-cover object-top"
          />
        )}
      </div>
    </div>
  );
};
