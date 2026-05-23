"use client";

import { useState } from "react";
import {
  DEFAULT_HEX,
  resolveColorHex,
} from "@/components/admin/productColorUtils";

export type ProductColor = { name: string; hex: string };

interface ProductColorsEditorProps {
  colors: ProductColor[];
  onChange: (colors: ProductColor[]) => void;
}

function ColorSwatch({
  hex,
  name,
  size = "md",
  onPick,
}: {
  hex: string;
  name: string;
  size?: "md" | "lg";
  onPick?: (hex: string) => void;
}) {
  const resolved = resolveColorHex(hex, name);
  const dim = size === "lg" ? "w-10 h-10" : "w-10 h-10";

  if (onPick) {
    return (
      <label
        className={`relative ${dim} rounded-full border border-outline-variant cursor-pointer shrink-0 block overflow-hidden`}
      >
        <span
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: resolved }}
          aria-hidden
        />
        <input
          type="color"
          value={resolved}
          onChange={(e) => onPick(e.target.value)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </label>
    );
  }

  return (
    <div
      className={`${dim} rounded-full border border-outline-variant shrink-0`}
      style={{ backgroundColor: resolved }}
    />
  );
}

export function ProductColorsEditor({ colors, onChange }: ProductColorsEditorProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [draftHex, setDraftHex] = useState(DEFAULT_HEX);
  const [pickerTouched, setPickerTouched] = useState(false);
  const [draftError, setDraftError] = useState("");

  const openAddForm = () => {
    setDraftName("");
    setDraftHex(DEFAULT_HEX);
    setPickerTouched(false);
    setDraftError("");
    setShowAddForm(true);
  };

  const handleSetColor = () => {
    const name = draftName.trim();
    if (!name) {
      setDraftError("Enter a color name before setting.");
      return;
    }
    if (colors.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
      setDraftError("This color name already exists.");
      return;
    }

    const hex = pickerTouched
      ? resolveColorHex(draftHex, name)
      : resolveColorHex("", name);

    onChange([...colors, { name, hex }]);
    setDraftName("");
    setDraftHex(DEFAULT_HEX);
    setPickerTouched(false);
    setDraftError("");
    setShowAddForm(false);
  };

  const removeColor = (index: number) => {
    onChange(colors.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-surface-container-low border border-outline-variant p-6 space-y-5">
      <div className="flex items-center justify-between border-b border-outline-variant pb-3">
        <h3 className="text-[11px] font-bold tracking-widest uppercase text-on-surface-variant">
          Color Variants
        </h3>
        <button
          type="button"
          onClick={openAddForm}
          className="flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase text-primary hover:opacity-70 transition-opacity"
        >
          <span className="material-symbols-outlined text-[14px]">add</span>
          Add Color
        </button>
      </div>

      <p className="text-[10px] text-on-surface-variant">
        Set color names and swatches shown on the product page and collection cards.
      </p>

      {showAddForm && (
        <div className="flex items-center gap-3 p-3 bg-surface-container border border-primary/40">
          <ColorSwatch
            hex={pickerTouched ? draftHex : ""}
            name={draftName}
            onPick={(value) => {
              setDraftHex(value);
              setPickerTouched(true);
            }}
          />

          <input
            type="text"
            value={draftName}
            onChange={(e) => {
              setDraftName(e.target.value);
              setDraftError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSetColor();
              }
            }}
            placeholder="e.g. Charcoal"
            autoFocus
            className="flex-1 bg-surface-container-low border border-outline-variant px-3 py-2 text-[13px] text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition-colors"
          />

          <button
            type="button"
            onClick={handleSetColor}
            disabled={!draftName.trim()}
            className="px-4 py-2 bg-primary text-on-primary text-[10px] font-bold tracking-widest uppercase hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
          >
            Set
          </button>

          <button
            type="button"
            onClick={() => {
              setShowAddForm(false);
              setDraftName("");
              setDraftHex(DEFAULT_HEX);
              setPickerTouched(false);
              setDraftError("");
            }}
            className="text-on-surface-variant hover:text-error transition-colors p-1 shrink-0"
            aria-label="Cancel"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}

      {draftError && (
        <p className="text-[11px] text-error">{draftError}</p>
      )}

      {colors.length > 0 ? (
        <div className="space-y-3 pt-2 border-t border-outline-variant/30">
          <span className="text-[9px] font-bold tracking-widest uppercase text-on-surface-variant">
            Set Colors
          </span>
          <div className="flex flex-wrap items-start gap-4">
            {colors.map((color, index) => (
              <div
                key={`${color.name}-${color.hex}-${index}`}
                className="flex flex-col items-center gap-1.5 shrink-0"
              >
                <div className="group relative">
                  <ColorSwatch hex={color.hex} name={color.name} />
                  <button
                    type="button"
                    onClick={() => removeColor(index)}
                    className="absolute inset-0 flex items-center justify-center rounded-full bg-primary/70 text-on-primary opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label={`Remove ${color.name}`}
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>
                <span className="text-[9px] text-on-surface-variant uppercase tracking-wider text-center max-w-[56px] truncate">
                  {color.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        !showAddForm && (
          <p className="text-[11px] text-on-surface-variant italic">
            No colors set. Click &quot;Add Color&quot; to add a variant.
          </p>
        )
      )}
    </div>
  );
}

export function normalizeProductColors(
  colors: ProductColor[]
): ProductColor[] {
  return colors
    .map((c) => ({
      name: c.name.trim(),
      hex: resolveColorHex(c.hex, c.name),
    }))
    .filter((c) => c.name.length > 0);
}
