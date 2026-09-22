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
  height = 40,
  alt = "Diamond Integrated Facility Services LLP",
}: LogoProps) {
  let src = "/images/logo.png";
  if (iconOnly) {
    src = "/images/logo-icon.png";
  } else if (variant === "light") {
    src = "/images/logo-white.png";
  }

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
