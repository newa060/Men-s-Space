"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Search, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SearchResult {
  id: string;
  name: string;
  price: number;
  slug: string;
  image: string;
  category: string;
}

export default function SearchDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = "";
      setQuery("");
      setResults([]);
      setSearched(false);
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const doSearch = useCallback(async (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) {
      setResults([]);
      setSearched(false);
      return;
    }

    setLoading(true);
    setSearched(false);
    try {
      const res = await fetch(`/api/products?search=${encodeURIComponent(trimmed)}`);
      const json = await res.json();
      if (json.success) {
        // Client-side filter as fallback if API doesn't support search param
        const filtered = (json.data as SearchResult[]).filter((p) =>
          p.name.toLowerCase().includes(trimmed.toLowerCase()) ||
          p.category.toLowerCase().includes(trimmed.toLowerCase())
        );
        setResults(filtered);
      } else {
        setResults([]);
      }
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  }, []);

  // Debounce — wait 300ms after user stops typing
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(query), 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, doSearch]);

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

          {/* Search Panel */}
          <motion.aside
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ type: "tween", duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-outline-variant shadow-2xl py-8 px-6 md:px-16"
          >
            <div className="max-w-screen-lg mx-auto">
              {/* Input row */}
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
                {loading ? (
                  <Loader2 size={18} className="animate-spin text-secondary flex-shrink-0" />
                ) : (
                  <button onClick={onClose} className="p-2 hover:bg-surface-container transition-colors" aria-label="Close search">
                    <X size={20} strokeWidth={1.5} />
                  </button>
                )}
              </div>

              {/* Results */}
              {query.trim() && (
                <div className="mt-8 border-t border-outline-variant pt-6">
                  <p className="label-caps text-secondary mb-4">
                    {loading ? "Searching…" : searched ? `${results.length} result${results.length !== 1 ? "s" : ""} for "${query}"` : ""}
                  </p>

                  {!loading && searched && results.length === 0 && (
                    <p className="text-sm text-secondary">
                      No results found for &ldquo;{query}&rdquo;. Try a different term.
                    </p>
                  )}

                  {results.length > 0 && (
                    <div className="space-y-3 max-h-72 overflow-y-auto">
                      {results.map((item) => (
                        <Link
                          key={item.slug}
                          href={`/product/${item.slug}`}
                          onClick={onClose}
                          className="flex items-center gap-4 py-2 border-b border-outline-variant/30 hover:opacity-70 transition-opacity group"
                        >
                          <div className="relative w-10 h-14 bg-surface-container flex-shrink-0 overflow-hidden border border-outline-variant/20">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="40px"
                              className="object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                            />
                          </div>
                          <div className="flex-grow min-w-0">
                            <p className="text-sm font-medium uppercase truncate">{item.name}</p>
                            <p className="text-xs text-secondary mt-0.5">{item.category}</p>
                          </div>
                          <span className="text-sm text-secondary flex-shrink-0">
                            ${item.price.toLocaleString()}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Empty state — nothing to show */}
              {!query.trim() && null}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
