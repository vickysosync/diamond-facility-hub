"use client";

import { useState, useRef } from "react";
import Icon from "@/components/ui/Icon";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  className?: string;
}

export default function ImageUpload({
  value = "",
  onChange,
  folder = "diamond_facility",
  label = "Upload Image",
  className = "",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 8MB)
    if (file.size > 8 * 1024 * 1024) {
      setError("File size exceeds 8MB limit.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      onChange(data.url);
    } catch (err: any) {
      console.error("Image upload error:", err);
      setError(err?.message || "Failed to upload image.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label className="block text-xs font-bold text-navy">{label}</label>}
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {value ? (
          <div className="relative group w-28 h-24 rounded-xl overflow-hidden border border-border bg-slate-100 shrink-0">
            <img
              src={value}
              alt="Uploaded preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs"
                title="Change Image"
              >
                <Icon name="sliders" className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onChange("")}
                className="p-1.5 bg-destructive/80 hover:bg-destructive text-white rounded-lg text-xs"
                title="Remove Image"
              >
                <Icon name="x" className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-28 h-24 rounded-xl border-2 border-dashed border-border hover:border-gold bg-mist/50 hover:bg-mist transition-colors cursor-pointer flex flex-col items-center justify-center gap-1.5 text-muted-foreground hover:text-navy shrink-0"
          >
            <Icon name="file" className="w-5 h-5 text-gold" />
            <span className="text-[11px] font-semibold">Select</span>
          </div>
        )}

        <div className="flex-1 space-y-1.5">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            onChange={handleUpload}
            className="hidden"
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="btn-base btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5"
            >
              {uploading ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Uploading to Cloudinary…
                </>
              ) : (
                <>
                  <Icon name="upload" className="w-3.5 h-3.5" />
                  {value ? "Replace Image" : "Upload to Cloudinary"}
                </>
              )}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="text-xs text-destructive hover:underline font-medium"
              >
                Clear
              </button>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground">
            Supports PNG, JPG, WEBP, SVG (Max 8MB). Stored securely on Cloudinary.
          </p>
          {error && <p className="text-xs text-destructive font-medium">{error}</p>}
        </div>
      </div>
    </div>
  );
}
