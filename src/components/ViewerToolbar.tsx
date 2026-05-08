"use client";

const PRESETS: { label: string; pos: [number, number, number] }[] = [
  { label: "Front", pos: [0, 0, 2.4] },
  { label: "3/4",   pos: [1.8, 1.5, 2.2] },
  { label: "Side",  pos: [3, 0, 0] },
  { label: "Top",   pos: [0, 2.8, 0.5] },
];

const BTN_BASE: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(0,0,0,0.55)",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
  border: "1px solid rgba(255,255,255,0.15)",
  color: "#fff",
  cursor: "pointer",
  outline: "none",
  transition: "background 0.15s",
};

const ICON_BTN: React.CSSProperties = {
  ...BTN_BASE,
  width: 34,
  height: 34,
  borderRadius: "50%",
  padding: 0,
  flexShrink: 0,
};

const PRESET_BTN: React.CSSProperties = {
  ...BTN_BASE,
  height: 30,
  padding: "0 10px",
  borderRadius: 15,
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: "0.03em",
  whiteSpace: "nowrap",
};

const DIVIDER: React.CSSProperties = {
  width: 1,
  height: 22,
  background: "rgba(255,255,255,0.18)",
  flexShrink: 0,
  alignSelf: "center",
};

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
      <polygon points="5,3 19,12 5,21" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
      <rect x="5" y="3" width="4" height="18" />
      <rect x="15" y="3" width="4" height="18" />
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.14 9.14 0 0 0-6.36 2.64L3 3" />
      <polyline points="3 3 3 9 9 9" />
    </svg>
  );
}

function FullscreenEnterIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
    </svg>
  );
}

function FullscreenExitIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 0 2-2h3M3 16h3a2 2 0 0 0 2 2v3" />
    </svg>
  );
}

interface ViewerToolbarProps {
  isPlaying: boolean;
  isFullscreen: boolean;
  onTogglePlay: () => void;
  onPreset: (pos: [number, number, number]) => void;
  onReset: () => void;
  onToggleFullscreen: () => void;
}

export default function ViewerToolbar({
  isPlaying,
  isFullscreen,
  onTogglePlay,
  onPreset,
  onReset,
  onToggleFullscreen,
}: ViewerToolbarProps) {
  const canFullscreen = typeof document !== "undefined" && !!document.fullscreenEnabled;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 12,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        alignItems: "center",
        gap: 5,
        zIndex: 10,
        pointerEvents: "none",
      }}
    >
      {/* Auto-rotate play/pause */}
      <button
        style={{ ...ICON_BTN, pointerEvents: "all" }}
        title={isPlaying ? "Pause rotation" : "Start rotation"}
        onClick={onTogglePlay}
      >
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>

      <div style={DIVIDER} />

      {/* Camera presets */}
      {PRESETS.map(({ label, pos }) => (
        <button
          key={label}
          style={{ ...PRESET_BTN, pointerEvents: "all" }}
          title={`${label} view`}
          onClick={() => onPreset(pos)}
        >
          {label}
        </button>
      ))}

      <div style={DIVIDER} />

      {/* Reset view */}
      <button
        style={{ ...ICON_BTN, pointerEvents: "all" }}
        title="Reset view"
        onClick={onReset}
      >
        <ResetIcon />
      </button>

      {/* Fullscreen (only if supported) */}
      {canFullscreen && (
        <button
          style={{ ...ICON_BTN, pointerEvents: "all" }}
          title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          onClick={onToggleFullscreen}
        >
          {isFullscreen ? <FullscreenExitIcon /> : <FullscreenEnterIcon />}
        </button>
      )}
    </div>
  );
}
