"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const SLIDE_MS = 800;
const CYCLE_MS = 2400;

interface ProductCardImageProps {
  image: string;
  images?: string[];
  alt: string;
  sizes?: string;
  className?: string;
}

export function ProductCardImage({
  image,
  images,
  alt,
  sizes = "(max-width: 768px) 100vw, 33vw",
  className = "",
}: ProductCardImageProps) {
  const gallery = useMemo(
    () =>
      [
        image,
        ...(images || []).filter((img) => img && img !== image),
      ].filter(Boolean),
    [image, images]
  );

  const slides = useMemo(
    () => (gallery.length > 1 ? [...gallery, gallery[0]] : gallery),
    [gallery]
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const activeIndexRef = useRef(0);

  activeIndexRef.current = activeIndex;

  const clearCycle = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const snapToIndex = useCallback((index: number) => {
    setTransitionEnabled(false);
    setActiveIndex(index);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setTransitionEnabled(true));
    });
  }, []);

  const handleTransitionEnd = useCallback(() => {
    if (gallery.length <= 1) return;
    if (activeIndex === gallery.length) {
      snapToIndex(0);
    }
  }, [activeIndex, gallery.length, snapToIndex]);

  const advanceSlide = useCallback(() => {
    setActiveIndex((prev) => {
      if (prev >= gallery.length) return prev;
      const next = prev + 1;
      return next <= gallery.length ? next : 1;
    });
  }, [gallery.length]);

  const handleMouseEnter = useCallback(() => {
    if (gallery.length <= 1) return;

    setActiveIndex(1);
    clearCycle();
    intervalRef.current = setInterval(advanceSlide, CYCLE_MS);
  }, [gallery.length, clearCycle, advanceSlide]);

  const handleMouseLeave = useCallback(() => {
    clearCycle();
    if (activeIndexRef.current === gallery.length) {
      snapToIndex(0);
    } else {
      setActiveIndex(0);
    }
  }, [clearCycle, gallery.length, snapToIndex]);

  useEffect(() => () => clearCycle(), [clearCycle]);

  return (
    <div
      className={`relative w-full h-full overflow-hidden ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="flex h-full ease-in-out"
        onTransitionEnd={handleTransitionEnd}
        style={{
          width: `${slides.length * 100}%`,
          transform: `translateX(-${(activeIndex * 100) / slides.length}%)`,
          transition: transitionEnabled
            ? `transform ${SLIDE_MS}ms ease-in-out`
            : "none",
        }}
      >
        {slides.map((src, index) => (
          <div
            key={`slide-${index}`}
            className="relative h-full flex-shrink-0"
            style={{ width: `${100 / slides.length}%` }}
          >
            <Image
              src={src}
              alt={
                index === 0 || index === gallery.length
                  ? alt
                  : `${alt} view ${index + 1}`
              }
              fill
              className="object-cover"
              sizes={sizes}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
