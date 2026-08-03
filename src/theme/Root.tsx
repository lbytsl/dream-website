import React, { useEffect, useRef } from "react";
import { useLocation } from "@docusaurus/router";
import SiteMotion from "@site/src/components/motion/SiteMotion";

declare global {
  interface Window {
    _hmt?: Array<unknown>;
  }
}

function BaiduSpaTracker(): null {
  const location = useLocation();
  const isInitialPage = useRef(true);

  useEffect(() => {
    window._hmt = window._hmt || [];
    if (isInitialPage.current) {
      isInitialPage.current = false;
      return;
    }
    window._hmt.push(["_trackPageview", `${location.pathname}${location.search}${location.hash}`]);
  }, [location.pathname, location.search, location.hash]);

  return null;
}

export default function Root({ children }: { children: React.ReactNode }): React.ReactNode {
  return (
    <SiteMotion>
      <BaiduSpaTracker />
      {children}
    </SiteMotion>
  );
}
