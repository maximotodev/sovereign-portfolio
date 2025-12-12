"use client";

import React, { useEffect, useState } from "react";
import {
  Cloud,
  fetchSimpleIcons,
  renderSimpleIcon,
  ICloud,
} from "react-icon-cloud";

const slugs = [
  "typescript",
  "javascript",
  "react",
  "nextdotjs",
  "nodedotjs",
  "python",
  "rust",
  "bitcoin",
  "linux",
  "docker",
  "git",
  "github",
  "neovim",
  "postgresql",
  "vercel",
  "tailwindcss",
  "figma",
  "android",
  "flutter",
  "django",
  "amazonwebservices",
  "nginx",
];

export default function TechCloud() {
  const [icons, setIcons] = useState<any>(null);

  useEffect(() => {
    fetchSimpleIcons({ slugs }).then(setIcons);
  }, []);

  const renderedIcons = React.useMemo(() => {
    if (!icons) return null;

    return Object.values(icons.simpleIcons).map((icon: any) =>
      renderSimpleIcon({
        icon,
        size: 42,
        aProps: {
          onClick: (e: any) => e.preventDefault(),
        },
        minContrastRatio: 2,
        bgHex: "#000000",
        fallbackHex: "#ffffff",
      })
    );
  }, [icons]);

  if (!icons) {
    return (
      <div className="flex items-center justify-center h-full text-neutral-500 text-xs animate-pulse font-mono">
        Loading Grid...
      </div>
    );
  }

  const cloudProps: Omit<ICloud, "children"> = {
    id: "tech-cloud",
    containerProps: {
      style: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        paddingTop: 10,
      },
    },
    options: {
      reverse: true,
      depth: 1,
      wheelZoom: false,
      imageScale: 2,
      activeCursor: "default",
      tooltip: "native",
      initial: [0.1, -0.1],
      clickToFront: 500,
      tooltipDelay: 0,
      outlineColour: "#0000",
      maxSpeed: 0.03,
      minSpeed: 0.01,
    },
  };

  return <Cloud {...cloudProps}>{renderedIcons}</Cloud>;
}
