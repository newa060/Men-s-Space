"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { uploadImageFile, uploadMediaFile, validateMediaFile, validateImageFile } from "@/lib/upload/client";

interface AdminImageFieldProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  aspectClass?: string;
  folder?: string;
  urlLabel?: string;
  emptyLabel?: string;
  acceptVideo?: boolean; // New prop to enable video uploads
}

export function AdminImageField({
  value,
  onChange,
  label,
  aspectClass = "aspect-[16/9]",
  folder = "studio",
  urlLabel = "Or paste image URL",
  emptyLabel = "Upload from device",
  acceptVideo = false,
}: AdminImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const isVideo = (url: string) => {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
    return videoExtensions.some(ext => url.toLowerCase().includes(ext));
  };

  const handleFile = async (file: File) => {
    console.log('File selected:', file.name, file.type, file.size);
    setError("");
    
    // Validate file based on acceptVideo prop
    console.log('acceptVideo:', acceptVideo);
    const validationError = acceptVideo ? validateMediaFile(file) : validateImageFile(file);
    console.log('Validation error:', validationError);
    
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setUploading(true);
    try {
      console.log('Starting upload...');
      const url = acceptVideo
        ? await uploadMediaFile(file, folder)
        : await uploadImageFile(file, folder);
      console.log('Upload successful:', url);
      onChange(url);
    } catch (err: unknown) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const acceptTypes = acceptVideo 
    ? "image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/ogg"
    : "image/jpeg,image/png,image/webp,image/gif";

  return (
    <div className="space-y-3">
      {label && (
        <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
          {label}
        </label>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={acceptTypes}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className={`w-full ${aspectClass} bg-surface-container-highest border border-outline-variant border-dashed overflow-hidden relative flex flex-col items-center justify-center gap-2 text-on-surface-variant hover:border-primary hover:text-primary transition-all disabled:opacity-60 disabled:cursor-wait`}
      >
        {value ? (
          isVideo(value) ? (
            <video
              src={value}
              className="absolute inset-0 w-full h-full object-cover"
              muted
              loop
              autoPlay
            />
          ) : (
            <Image
              src={value}
              alt="Preview"
              fill
              unoptimized
              className="object-cover"
            />
          )
        ) : (
          <>
            <span className="material-symbols-outlined text-[32px] opacity-50">
              {acceptVideo ? 'video_library' : 'add_photo_alternate'}
            </span>
            <span className="text-[10px] font-bold tracking-widest uppercase">
              {uploading ? "Uploading…" : emptyLabel}
            </span>
          </>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-primary/40 flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary text-[28px] animate-spin">
              progress_activity
            </span>
          </div>
        )}
      </button>

      {value && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full py-2 text-[10px] font-bold tracking-widest uppercase border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
        >
          {uploading ? "Uploading…" : `Replace ${acceptVideo ? 'media' : 'image'}`}
        </button>
      )}

      <div className="space-y-1.5">
        <label className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">
          {acceptVideo ? 'Or paste image/video/YouTube URL' : urlLabel}
        </label>
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={acceptVideo ? "https://... or YouTube URL" : "https://..."}
          className="w-full bg-surface border border-outline-variant px-3 py-2 text-[12px] text-on-surface focus:outline-none focus:border-primary"
        />
      </div>

      {error && <p className="text-[11px] text-error">{error}</p>}
    </div>
  );
}
