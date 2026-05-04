"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { METAL_PRESETS, STONE_PRESETS, type MetalPreset, type StonePreset } from "@/components/presets";

const JewelryViewer = dynamic(() => import("@/components/JewelryViewer"), { ssr: false });

const DEFAULT_URL = "/models/ER-0001.glb";

function Swatch({ color, label, selected, onClick }: {
  color: string; label: string; selected: boolean; onClick: () => void;
}) {
  return (
    <button
      title={label}
      onClick={onClick}
      style={{
        width: 32, height: 32, borderRadius: "50%",
        background: color,
        border: selected ? "3px solid #222" : "2px solid #ccc",
        cursor: "pointer", outline: "none", padding: 0,
        boxShadow: selected ? "0 0 0 2px #fff inset" : "none",
        transition: "border 0.15s",
      }}
    />
  );
}

function encodePath(raw: string) {
  const parts = raw.trim().split("/");
  const filename = parts.pop() ?? "";
  return [...parts, encodeURIComponent(filename)].join("/");
}

export default function Page() {
  const [modelUrl, setModelUrl] = useState(DEFAULT_URL);
  const [input, setInput] = useState(DEFAULT_URL);
  const [metal, setMetal] = useState<MetalPreset>(METAL_PRESETS["Yellow Gold 18K"]);
  const [stone, setStone] = useState<StonePreset>(STONE_PRESETS["White Diamond"]);

  return (
    <div style={{
      minHeight: "100vh", background: "#f0f0f0",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: 24, gap: 16,
    }}>

         {/* Rhino link */}
      {/* <div style={{ display: "flex", gap: 16 }}>
        <Link href="/stl" style={{ fontSize: 12, color: "#999" }}>→ STL viewer</Link>
        <Link href="/compare" style={{ fontSize: 12, color: "#999" }}>→ Compare (original glb.jsx)</Link>
      </div> */}

      {/* GLB input */}
      <div style={{ display: "flex", gap: 8 }}>
        <input
          style={{
            width: 360, padding: "8px 12px", borderRadius: 8,
            background: "#fff", border: "1px solid #ddd",
            color: "#222", fontSize: 13, outline: "none",
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
   

      {/* Viewer card */}
      <div style={{
        width: 600, height: 600, borderRadius: 16,
        background: "#fff", boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
        overflow: "hidden",
      }}>
        <JewelryViewer modelUrl={modelUrl} metal={metal} stone={stone} />
      </div>

      

      {/* Swatches */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 12, color: "#666", width: 42 }}>Metal</span>
          <div style={{ display: "flex", gap: 8 }}>
            {Object.entries(METAL_PRESETS).map(([name, preset]) => (
              <Swatch
                key={name}
                label={name}
                color={preset.color}
                selected={metal === preset}
                onClick={() => setMetal(preset)}
              />
            ))}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 12, color: "#666", width: 42 }}>Stone</span>
          <div style={{ display: "flex", gap: 8 }}>
            {Object.entries(STONE_PRESETS).map(([name, preset]) => (
              <Swatch
                key={name}
                label={name}
                color={preset.color}
                selected={stone === preset}
                onClick={() => setStone(preset)}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
