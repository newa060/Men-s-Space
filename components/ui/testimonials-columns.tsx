"use client";

import React from "react";
import { motion } from "framer-motion";

export interface TestimonialItem {
  text: string;
  name: string;
  role: string;
  image?: string;
}

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: TestimonialItem[];
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{ translateY: "-50%" }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[...new Array(2)].map((_, index) => (
          <React.Fragment key={index}>
            {props.testimonials.map(({ text, image, name, role }, i) => (
              <div
                key={i}
                className="p-8 border border-outline-variant bg-surface-container max-w-xs w-full"
              >
                <p className="text-sm text-on-surface-variant leading-relaxed font-light">
                  &ldquo;{text}&rdquo;
                </p>
                <div className="flex items-center gap-3 mt-5">
                  {image ? (
                    <img
                      width={36}
                      height={36}
                      src={image}
                      alt={name}
                      className="h-9 w-9 rounded-full object-cover grayscale"
                    />
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center text-xs font-semibold text-on-surface-variant uppercase">
                      {name.charAt(0)}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold tracking-wide text-on-surface uppercase">
                      {name}
                    </span>
                    <span className="text-xs text-secondary tracking-wide">
                      {role}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
};
