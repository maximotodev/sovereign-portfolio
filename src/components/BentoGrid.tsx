import React from "react";
import { cn } from "@/lib/utils";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        // Ensure consistent gap and full width
        "grid grid-cols-1 md:grid-cols-3 gap-6 w-full",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoItem = ({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "rounded-xl group/bento hover:-translate-y-1 transition duration-200 shadow-xl",
        "bg-neutral-900 border border-neutral-800 p-6 flex flex-col justify-between space-y-4 h-full", // Added h-full
        className
      )}
    >
      {header}
      <div className="group-hover/bento:translate-x-2 transition duration-200 mt-2">
        <div className="flex items-center gap-2 mb-1">
          {icon}
          <div className="font-bold text-neutral-200 font-sans text-sm tracking-wide">
            {title}
          </div>
        </div>
        <div className="font-normal text-neutral-400 text-xs leading-relaxed font-mono">
          {description}
        </div>
      </div>
    </div>
  );
};
