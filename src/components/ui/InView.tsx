"use client";

import React, { useEffect, useRef, useState } from "react";

export interface InViewProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  threshold?: number;
  direction?: "up" | "down" | "left" | "right" | "fade";
}

export default function InView({
  children,
  delay = 0,
  className = "",
  threshold = 0.12,
  direction = "up",
}: InViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Immediate fallback if IntersectionObserver is unsupported
    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  const getDirectionClasses = () => {
    switch (direction) {
      case "down":
        return isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 -translate-y-8 scale-[0.98]";
      case "left":
        return isVisible
          ? "opacity-100 translate-x-0 scale-100"
          : "opacity-0 -translate-x-8 scale-[0.98]";
      case "right":
        return isVisible
          ? "opacity-100 translate-x-0 scale-100"
          : "opacity-0 translate-x-8 scale-[0.98]";
      case "fade":
        return isVisible ? "opacity-100 scale-100" : "opacity-0 scale-[0.98]";
      case "up":
      default:
        return isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-8 scale-[0.98]";
    }
  };

  return (
    <div
      ref={ref}
      style={{
        transitionDuration: "850ms",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        transitionDelay: `${delay}ms`,
      }}
      className={`transition-all will-change-[opacity,transform] ${getDirectionClasses()} ${className}`}
    >
      {children}
    </div>
  );
}
