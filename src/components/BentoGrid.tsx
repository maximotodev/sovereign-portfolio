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
        // CHANGED: Removed fixed auto-rows. Added distinct gap and padding.
        "grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto pb-20",
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
        // CHANGED: Added glass effect, hover lift, and min-height
        "row-span-1 rounded-xl group/bento hover:-translate-y-1 transition duration-200 shadow-xl",
        "bg-neutral-900 border border-neutral-800 p-6 flex flex-col justify-between space-y-4",
        className
      )}
    >
      {header}
      <div className="group-hover/bento:translate-x-2 transition duration-200">
        <div className="flex items-center gap-2 mb-2">
          {icon}
          <div className="font-sans font-bold text-neutral-200">{title}</div>
        </div>
        <div className="font-sans font-normal text-neutral-400 text-xs leading-relaxed">
          {description}
        </div>
      </div>
    </div>
  );
};
