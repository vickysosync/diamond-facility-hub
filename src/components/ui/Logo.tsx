import React from "react";

export interface LogoProps {
  variant?: "dark" | "light";
  iconOnly?: boolean;
  className?: string;
  height?: number | string;
  alt?: string;
}

export default function Logo({
  variant = "dark",
  iconOnly = false,
  className = "",
  height = 44,
  alt = "Diamond Integrated Facility Services LLP",
}: LogoProps) {
  const src = iconOnly ? "/images/logo-icon.png" : "/images/logo.png";
  const heightStyle = typeof height === "number" ? `${height}px` : height;

  return (
    <img
      src={src}
      alt={alt}
      style={{ height: heightStyle, width: "auto" }}
      className={`inline-block object-contain ${className}`}
      loading="eager"
    />
  );
}

