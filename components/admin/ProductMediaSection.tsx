"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { uploadImageFile } from "@/lib/upload/client";

interface ProductMediaSectionProps {
  imageUrl: string;
  onImageUrlChange: (url: string) => void;
  additionalImages: string[];
  onAdditionalImagesChange: (urls: string[]) => void;
}

export function ProductMediaSection({
  imageUrl,
  onImageUrlChange,
  additionalImages,
  onAdditionalImagesChange,
}: ProductMediaSectionProps) {
  const primaryInputRef = useRef<HTMLInputElement>(null);
  const additionalInputRef = useRef<HTMLInputElement>(null);

  const [primaryUploading, setPrimaryUploading] = useState(false);
  const [additionalUploading, setAdditionalUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handlePrimaryFile = async (file: File) => {
    setUploadError("");
    setPrimaryUploading(true);
    try {
      const url = await uploadImageFile(file, "products");
      onImageUrlChange(url);
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setPrimaryUploading(false);
    }
  };

  const handleAdditionalFiles = async (files: FileList | null) => {
    if (!files?.length) return;

    setUploadError("");
    setAdditionalUploading(true);
    const uploaded: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const url = await uploadImageFile(file, "products");
        uploaded.push(url);
      }
      onAdditionalImagesChange([
        ...additionalImages.filter(Boolean),
        ...uploaded,
      ]);
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setAdditionalUploading(false);
      if (additionalInputRef.current) additionalInputRef.current.value = "";
    }
  };

  return (
    <div className="bg-surface-container-low border border-outline-variant p-6 space-y-4">
      <h3 className="text-[11px] font-bold tracking-widest uppercase text-on-surface-variant border-b border-outline-variant pb-3">
        Media
      </h3>

      <input
        ref={primaryInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handlePrimaryFile(file);
          e.target.value = "";
        }}
      />

      <button
        type="button"
        onClick={() => primaryInputRef.current?.click()}
        disabled={primaryUploading}
        className="w-full aspect-[4/5] bg-surface-container border border-outline-variant border-dashed flex flex-col items-center justify-center gap-3 text-on-surface-variant hover:border-primary hover:text-primary transition-all group relative overflow-hidden disabled:opacity-60 disabled:cursor-wait"
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt="Preview"
            fill
            unoptimized
            className="object-cover"
          />
        ) : (
          <>
            <span className="material-symbols-outlined text-[40px] opacity-40 group-hover:opacity-70 transition-opacity">
              add_photo_alternate
            </span>
            <p className="text-[11px] font-semibold tracking-widest uppercase text-center">
              {primaryUploading ? "Uploading…" : "Upload from device"}
            </p>
            <p className="text-[10px] text-outline text-center px-4">
              PNG, JPG, WEBP or GIF
              <br />
              Recommended 4:5 ratio
            </p>
          </>
        )}
        {primaryUploading && imageUrl && (
          <div className="absolute inset-0 bg-primary/40 flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary text-[32px] animate-spin">
              progress_activity
            </span>
          </div>
        )}
      </button>

      {imageUrl && (
        <button
          type="button"
          onClick={() => primaryInputRef.current?.click()}
          disabled={primaryUploading}
          className="w-full py-2 text-[10px] font-bold tracking-widest uppercase border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
        >
          {primaryUploading ? "Uploading…" : "Replace image"}
        </button>
      )}

      <div className="space-y-1.5">
        <label className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">
          Or paste image URL
        </label>
        <input
          type="url"
          value={imageUrl}
          onChange={(e) => onImageUrlChange(e.target.value)}
          placeholder="https://..."
          className="w-full bg-surface-container border border-outline-variant px-4 py-2.5 text-[13px] text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      <div className="space-y-2 pt-2 border-t border-outline-variant/30">
        <label className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">
          Additional Images
        </label>
        <p className="text-[10px] text-on-surface-variant">
          Upload from your device or paste URLs for the product gallery.
        </p>

        <input
          ref={additionalInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="hidden"
          onChange={(e) => handleAdditionalFiles(e.target.files)}
        />

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => additionalInputRef.current?.click()}
            disabled={additionalUploading}
            className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-primary hover:opacity-70 transition-opacity disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[14px]">
              {additionalUploading ? "progress_activity" : "upload"}
            </span>
            {additionalUploading ? "Uploading…" : "Upload from device"}
          </button>
          <button
            type="button"
            onClick={() => onAdditionalImagesChange([...additionalImages, ""])}
            className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[14px]">add</span>
            Add URL
          </button>
        </div>

        <div className="space-y-2">
          {additionalImages.map((url, i) => (
            <div key={i} className="flex gap-2 items-center">
              {url ? (
                <div className="relative w-10 h-12 shrink-0 bg-surface-container border border-outline-variant overflow-hidden">
                  <Image
                    src={url}
                    alt=""
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-10 h-12 shrink-0 bg-surface-container border border-outline-variant border-dashed" />
              )}
              <input
                type="url"
                value={url}
                onChange={(e) => {
                  const updated = [...additionalImages];
                  updated[i] = e.target.value;
                  onAdditionalImagesChange(updated);
                }}
                placeholder="https://..."
                className="flex-1 bg-surface-container border border-outline-variant px-3 py-2 text-[13px] text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition-colors"
              />
              <button
                type="button"
                onClick={() =>
                  onAdditionalImagesChange(
                    additionalImages.filter((_, idx) => idx !== i)
                  )
                }
                className="text-on-surface-variant hover:text-error transition-colors"
                aria-label="Remove image"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {uploadError && (
        <p className="text-[11px] text-error">{uploadError}</p>
      )}
    </div>
  );
}
