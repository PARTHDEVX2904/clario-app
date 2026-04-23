"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function TopLoaderBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    // Reset
    bar.style.transition = "none";
    bar.style.transform = "scaleX(0)";
    bar.style.opacity = "1";

    const raf = requestAnimationFrame(() => {
      bar.style.transition = "transform 0.35s ease-out";
      bar.style.transform = "scaleX(1)";

      const hide = setTimeout(() => {
        bar.style.transition = "opacity 0.25s ease";
        bar.style.opacity = "0";
      }, 450);

      return () => clearTimeout(hide);
    });

    return () => cancelAnimationFrame(raf);
  }, [pathname, searchParams]);

  return (
    <div
      ref={barRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "2px",
        background: "#000",
        transformOrigin: "left center",
        zIndex: 9999,
        opacity: 0,
        pointerEvents: "none",
      }}
    />
  );
}

export function TopLoader() {
  return (
    <Suspense fallback={null}>
      <TopLoaderBar />
    </Suspense>
  );
}
