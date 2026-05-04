"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { METAL_PRESETS, STONE_PRESETS, type MetalPreset, type StonePreset } from "@/components/presets";

const EnhancedViewer = dynamic(() => import("@/components/EnhancedViewer"), { ssr: false });

const DEFAULT_URL = "/models/ER-0001.glb";

function encodePath(raw: string) {
  const parts = raw.trim().split("/");
  const filename = parts.pop() ?? "";
  return [...parts, encodeURIComponent(filename)].join("/");
}

function Swatch({ color, label, selected, onClick }: {
  color: string; label: string; selected: boolean; onClick: () => void;
}) {
  return (
    <button
      title={label}
      onClick={onClick}
      style={{
        width: 28, height: 28, borderRadius: "50%",
        background: color,
        border: selected ? "3px solid #fff" : "2px solid #555",
        cursor: "pointer", outline: "none", padding: 0,
        boxShadow: selected ? "0 0 0 2px #333 inset" : "none",
        transition: "border 0.15s",
      }}
    />
  );
}

export default function ComparePage() {
  const [modelUrl, setModelUrl] = useState(DEFAULT_URL);
  const [input, setInput]       = useState(DEFAULT_URL);
  const [metal, setMetal]       = useState<MetalPreset>(METAL_PRESETS["Yellow Gold 18K"]);
  const [stone, setStone]       = useState<StonePreset>(STONE_PRESETS["White Diamond"]);

  return (
    <div style={{
      minHeight: "100vh", background: "#111",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: 24, gap: 16,
    }}>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <Link href="/" style={{ color: "#888", fontSize: 12 }}>← Standard viewer</Link>
        <span style={{ color: "#333", fontSize: 12 }}>|</span>
        <span style={{ color: "#e0b84e", fontSize: 13, fontWeight: 600 }}>Enhanced</span>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          style={{
            width: 360, padding: "8px 12px", borderRadius: 8,
            background: "#222", border: "1px solid #444",
            color: "#eee", fontSize: 13, outline: "none",
          }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && setModelUrl(encodePath(input))}
          placeholder="GLB path or URL…"
        />
        <button
          onClick={() => setModelUrl(encodePath(input))}
          style={{
            padding: "8px 16px", borderRadius: 8, border: "none",
            background: "#e0b84e", color: "#000", fontSize: 13,
            fontWeight: 600, cursor: "pointer",
          }}
        >
          Load
        </button>
      </div>

      <div style={{
        width: 600, height: 600, borderRadius: 16,
        background: "#1a1a1a", boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
        overflow: "hidden",
      }}>
        <EnhancedViewer modelUrl={modelUrl} metal={metal} stone={stone} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 12, color: "#666", width: 42 }}>Metal</span>
          <div style={{ display: "flex", gap: 8 }}>
            {Object.entries(METAL_PRESETS).map(([name, preset]) => (
              <Swatch key={name} label={name} color={preset.color}
                selected={metal === preset} onClick={() => setMetal(preset)} />
            ))}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 12, color: "#666", width: 42 }}>Stone</span>
          <div style={{ display: "flex", gap: 8 }}>
            {Object.entries(STONE_PRESETS).map(([name, preset]) => (
              <Swatch key={name} label={name} color={preset.color}
                selected={stone === preset} onClick={() => setStone(preset)} />
            ))}
          </div>
        </div>
      </div>

      <p style={{ fontSize: 11, color: "#444", margin: 0 }}>
        Three.js · Poly Haven HDRI · SSAO · Vignette · Bloom
      </p>
    </div>
  );
}
