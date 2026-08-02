import React from "react";
import SiteMotion from "@site/src/components/motion/SiteMotion";

export default function Root({ children }: { children: React.ReactNode }): React.ReactNode {
  return <SiteMotion>{children}</SiteMotion>;
}
