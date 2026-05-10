import { useEffect, useState } from 'react'

/**
 * Dev-only "preview at this device size" widget.
 *
 * A small floating button bottom-right of every page. Click it to pick a
 * device preset; an overlay appears with an iframe sized to that device's
 * width. The iframe loads the current pathname + hash, so the real app
 * renders at the chosen viewport - all media queries, useSnapPaging,
 * IntersectionObservers etc. fire as if the user were actually on a phone.
 *
 * Gates on import.meta.env.DEV so this never ships in `npm run build`.
 *
 * Suppressed inside the iframe itself (window.self !== window.top) so the
 * preview doesn't show its own preview button recursively.
 */

type Device = {
  id: string
  label: string
  /** Viewport width in CSS px. */
  w: number
  /** Viewport height in CSS px. */
  h: number
}

const DEVICES: Device[] = [
  { id: 'iphone-se', label: 'iPhone SE',      w: 375, h: 667 },
  { id: 'iphone-pro', label: 'iPhone Pro',    w: 393, h: 852 },
  { id: 'pixel-7',   label: 'Pixel 7',        w: 412, h: 915 },
  { id: 'ipad-mini', label: 'iPad mini',      w: 744, h: 1133 },
  { id: 'ipad',      label: 'iPad portrait',  w: 768, h: 1024 },
  { id: 'ipad-land', label: 'iPad landscape', w: 1024, h: 768 },
]

function isInIframe() {
  try {
    return window.self !== window.top
  } catch {
    // Cross-origin frame — assume yes
    return true
  }
}

export function DevicePreview() {
  const [open, setOpen] = useState(false)
  const [device, setDevice] = useState<Device | null>(null)

  // Esc closes whichever layer is open (modal first, then panel).
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== 'Escape') return
      if (device) setDevice(null)
      else if (open) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [device, open])

  // Disable in production builds and when running inside the preview iframe.
  if (!import.meta.env.DEV) return null
  if (isInIframe()) return null

  return (
    <>
      {/* Floating launcher */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        title="Device preview (dev only)"
        aria-label="Toggle device preview"
        style={launcherStyle}
      >
        <PhoneIcon />
      </button>

      {/* Preset picker panel */}
      {open && !device && (
        <div style={panelStyle}>
          <div style={panelHeadStyle}>
            <span>Device preview</span>
            <button type="button" onClick={() => setOpen(false)} style={closeBtnStyle} aria-label="Close">
              ×
            </button>
          </div>
          <div style={panelBodyStyle}>
            {DEVICES.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setDevice(d)}
                style={presetBtnStyle}
              >
                <span>{d.label}</span>
                <span style={presetDimStyle}>
                  {d.w}<span style={{ opacity: 0.5 }}>×</span>{d.h}
                </span>
              </button>
            ))}
          </div>
          <div style={panelFootStyle}>
            Loads the current path inside an iframe at the chosen size.
            Esc to close.
          </div>
        </div>
      )}

      {/* Active preview overlay */}
      {device && <PreviewOverlay device={device} onClose={() => setDevice(null)} />}
    </>
  )
}

function PreviewOverlay({ device, onClose }: { device: Device; onClose: () => void }) {
  // The iframe loads whatever route + hash the host is on right now.
  const path = window.location.pathname + window.location.search + window.location.hash
  return (
    <div style={overlayStyle} onClick={onClose}>
      <div
        style={{ ...overlayInnerStyle, width: device.w, height: device.h }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={overlayChromeStyle}>
          <span>{device.label} · {device.w}×{device.h}</span>
          <button type="button" onClick={onClose} style={closeBtnStyle} aria-label="Close preview">
            ×
          </button>
        </div>
        <iframe
          src={path}
          title={`Preview at ${device.label}`}
          style={iframeStyle}
        />
      </div>
    </div>
  )
}

/* ---------------- inline styles (intentionally not in the design CSS,
   this is dev chrome) ---------------- */

const launcherStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: 16,
  right: 16,
  width: 44,
  height: 44,
  borderRadius: 999,
  background: 'rgba(14, 17, 32, 0.78)',
  color: '#F5F1E8',
  border: '1px solid rgba(245, 241, 232, 0.18)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  zIndex: 9999,
  boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
  backdropFilter: 'blur(8px)',
}

const panelStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: 72,
  right: 16,
  width: 260,
  borderRadius: 12,
  background: 'rgba(14, 17, 32, 0.92)',
  border: '1px solid rgba(245, 241, 232, 0.14)',
  color: '#F5F1E8',
  fontFamily: 'system-ui, sans-serif',
  fontSize: 13,
  zIndex: 9999,
  boxShadow: '0 10px 40px rgba(0,0,0,0.35)',
  backdropFilter: 'blur(10px)',
  overflow: 'hidden',
}

const panelHeadStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 14px',
  borderBottom: '1px solid rgba(245, 241, 232, 0.10)',
  fontWeight: 500,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  fontSize: 11,
  opacity: 0.9,
}

const panelBodyStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  padding: 6,
  gap: 2,
}

const presetBtnStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  background: 'transparent',
  color: 'inherit',
  border: 'none',
  padding: '10px 10px',
  borderRadius: 6,
  cursor: 'pointer',
  fontSize: 13,
  textAlign: 'left',
  fontFamily: 'inherit',
}

const presetDimStyle: React.CSSProperties = {
  fontVariantNumeric: 'tabular-nums',
  fontSize: 12,
  opacity: 0.55,
}

const panelFootStyle: React.CSSProperties = {
  padding: '10px 14px 12px',
  borderTop: '1px solid rgba(245, 241, 232, 0.08)',
  fontSize: 11,
  opacity: 0.55,
  lineHeight: 1.4,
}

const closeBtnStyle: React.CSSProperties = {
  background: 'transparent',
  color: 'inherit',
  border: 'none',
  cursor: 'pointer',
  fontSize: 18,
  lineHeight: 1,
  padding: 4,
  width: 28,
  height: 28,
  borderRadius: 4,
}

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(14, 17, 32, 0.72)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 10000,
  padding: 24,
}

const overlayInnerStyle: React.CSSProperties = {
  background: '#000',
  borderRadius: 28,
  border: '6px solid #1a1a1a',
  boxShadow: '0 30px 80px rgba(0,0,0,0.55)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  maxWidth: 'calc(100vw - 48px)',
  maxHeight: 'calc(100vh - 48px)',
}

const overlayChromeStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '6px 14px',
  background: '#1a1a1a',
  color: '#F5F1E8',
  fontFamily: 'system-ui, sans-serif',
  fontSize: 11,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  flexShrink: 0,
}

const iframeStyle: React.CSSProperties = {
  flex: 1,
  width: '100%',
  border: 'none',
  background: '#fff',
  display: 'block',
}

function PhoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
      <line x1="11" y1="18" x2="13" y2="18" strokeLinecap="round" />
    </svg>
  )
}
