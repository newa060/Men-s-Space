"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SearchDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = "";
      setQuery("");
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const searchResults = query.trim()
    ? [
        { name: "ARCHITECTURAL OVERCOAT", price: 1290, slug: "architectural-overcoat" },
        { name: "STRUCTURAL POPLIN SHIRT", price: 390, slug: "structural-poplin-shirt" },
        { name: "MINIMALIST WORK JACKET", price: 890, slug: "minimalist-work-jacket" },
      ].filter((item) => item.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Search Panel (Top drop-down) */}
          <motion.aside
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ type: "tween", duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-outline-variant shadow-2xl py-8 px-6 md:px-16"
          >
            <div className="max-w-screen-lg mx-auto">
              <div className="flex items-center justify-between gap-4">
                <Search size={20} className="text-secondary flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search our collection..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent text-xl font-light focus:outline-none placeholder:text-outline"
                />
                <button onClick={onClose} className="p-2 hover:bg-surface-container transition-colors" aria-label="Close search">
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>

              {/* Results */}
              {query && (
                <div className="mt-8 border-t border-outline-variant pt-6">
                  <p className="label-caps text-secondary mb-4">Results</p>
                  {searchResults.length > 0 ? (
                    <div className="space-y-4">
                      {searchResults.map((item) => (
                        <div key={item.slug} className="flex justify-between items-center py-2 border-b border-outline-variant/30">
                          <Link href={`/product/${item.slug}`} onClick={onClose} className="text-sm font-medium hover:opacity-60 transition-opacity">
                            {item.name}
                          </Link>
                          <span className="text-sm text-secondary">${item.price}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-secondary">No results found for &ldquo;{query}&rdquo;</p>
                  )}
                </div>
              )}

              {/* Suggestions */}
              {!query && (
                <div className="mt-8 border-t border-outline-variant pt-6">
                  <p className="label-caps text-secondary mb-3">Trending Searches</p>
                  <div className="flex flex-wrap gap-2">
                    {["Overcoats", "Poplin Shirts", "Jackets", "Minimalist"].map((term) => (
                      <button
                        key={term}
                        onClick={() => setQuery(term)}
                        className="text-xs px-3 py-1.5 border border-outline-variant hover:border-primary transition-colors text-secondary hover:text-primary"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
