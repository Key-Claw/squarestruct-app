const iconPaths = {
  cart: (
    <>
      <path d="M0.75 1.25h2.1l1.35 8.1a1.5 1.5 0 0 0 1.48 1.25h6.92a1.5 1.5 0 0 0 1.45-1.11l1.06-4.03H4.02" />
      <circle cx="6.2" cy="13.6" r="1.15" />
      <circle cx="12.3" cy="13.6" r="1.15" />
    </>
  ),
  box: (
    <>
      <path d="M2.1 5.05 8 1.9l5.9 3.15v5.9L8 14.1l-5.9-3.15v-5.9Z" />
      <path d="M2.1 5.05 8 8.2l5.9-3.15M8 8.2v5.9" />
    </>
  ),
  checkCircle: (
    <>
      <circle cx="8" cy="8" r="6.25" />
      <path d="m4.9 8.15 2.05 2.05 4.15-4.4" />
    </>
  ),
  headset: (
    <>
      <path d="M2.5 8.4a5.5 5.5 0 0 1 11 0" />
      <path d="M2.5 8.4v2.2a1.55 1.55 0 0 0 1.55 1.55h.75V7.2h-.75A1.55 1.55 0 0 0 2.5 8.75" />
      <path d="M13.5 8.4v2.2a1.55 1.55 0 0 1-1.55 1.55h-.75V7.2h.75a1.55 1.55 0 0 1 1.55 1.55" />
      <path d="M11.2 12.15c0 1.1-.9 1.95-2 1.95H8" />
    </>
  ),
  shield: (
    <path d="M8 1.6 13 3.5v3.7c0 3.15-1.95 5.55-5 7.2-3.05-1.65-5-4.05-5-7.2V3.5L8 1.6Z" />
  ),
  warning: (
    <>
      <path d="M8 2.1 14.25 13H1.75L8 2.1Z" />
      <path d="M8 5.7v3.35M8 11.35h.01" />
    </>
  ),
  fullscreen: (
    <>
      <path d="M2.4 6V2.4H6M10 2.4h3.6V6M13.6 10v3.6H10M6 13.6H2.4V10" />
      <path d="M5.75 2.4 2.4 5.75M10.25 2.4l3.35 3.35M13.6 10.25l-3.35 3.35M2.4 10.25l3.35 3.35" />
    </>
  ),
  fit: (
    <>
      <rect x="3" y="3" width="10" height="10" rx="1.4" />
      <path d="M5.2 8h5.6M8 5.2v5.6" />
    </>
  ),
  move: (
    <>
      <path d="M8 1.8v12.4M1.8 8h12.4" />
      <path d="m5.7 3.9 2.3-2.1 2.3 2.1M5.7 12.1 8 14.2l2.3-2.1M3.9 5.7 1.8 8l2.1 2.3M12.1 5.7 14.2 8l-2.1 2.3" />
    </>
  ),
  rotate: (
    <>
      <path d="M12.55 5.15A5.1 5.1 0 1 0 13 8" />
      <path d="M12.75 2.4v2.95H9.8" />
    </>
  ),
  undo: (
    <>
      <path d="M5.8 4.6H2.4V1.2" />
      <path d="M2.4 4.6c1.2-1.6 3.2-2.7 5.6-2.7 3.5 0 6.4 2.9 6.4 6.4s-2.9 6.4-6.4 6.4c-1.8 0-3.4-.7-4.6-1.8" />
      <path d="m4.2 11.8-1.8-2.2 2.8-.4" />
    </>
  ),
  redo: (
    <>
      <path d="M10.2 4.6h3.4V1.2" />
      <path d="M13.6 4.6c-1.2-1.6-3.2-2.7-5.6-2.7-3.5 0-6.4 2.9-6.4 6.4s2.9 6.4 6.4 6.4c1.8 0 3.4-.7 4.6-1.8" />
      <path d="m11.8 11.8 1.8-2.2-2.8-.4" />
    </>
  ),
  swap: (
    <>
      <path d="M3 5h9.2" />
      <path d="m9.9 2.7 2.3 2.3-2.3 2.3" />
      <path d="M13 11H3.8" />
      <path d="m6.1 8.7-2.3 2.3 2.3 2.3" />
    </>
  ),
  save: (
    <>
      <path d="M3 2.4h8.1l1.9 1.9v9.3H3V2.4Z" />
      <path d="M5 2.4v4.1h5.5V2.4M5.1 13.6V9.4h5.8v4.2" />
    </>
  ),
  trash: (
    <>
      <path d="M2.8 4.2h10.4M6.2 4.2V2.6h3.6v1.6M4.2 4.2l.6 9.2h6.4l.6-9.2" />
      <path d="M6.7 6.8v4.1M9.3 6.8v4.1" />
    </>
  ),
  grid: (
    <>
      <rect x="2.4" y="2.4" width="4.2" height="4.2" rx="0.7" />
      <rect x="9.4" y="2.4" width="4.2" height="4.2" rx="0.7" />
      <rect x="2.4" y="9.4" width="4.2" height="4.2" rx="0.7" />
      <rect x="9.4" y="9.4" width="4.2" height="4.2" rx="0.7" />
    </>
  ),
  list: (
    <>
      <path d="M5.2 3.6h8M5.2 8h8M5.2 12.4h8" />
      <path d="M2.6 3.6h.01M2.6 8h.01M2.6 12.4h.01" />
    </>
  ),
  image: (
    <>
      <rect x="2.2" y="3" width="11.6" height="10" rx="1.4" />
      <circle cx="5.6" cy="6.1" r="1.1" />
      <path d="m3.6 11 3.1-3.1 2.1 2.1 1.2-1.2 2.4 2.2" />
    </>
  ),
  eye: (
    <>
      <path d="M1.8 8s2.2-4 6.2-4 6.2 4 6.2 4-2.2 4-6.2 4-6.2-4-6.2-4Z" />
      <circle cx="8" cy="8" r="1.9" />
    </>
  ),
  cube: (
    <>
      <path d="m8 1.8 5.35 3.05v6.25L8 14.2l-5.35-3.1V4.85L8 1.8Z" />
      <path d="M2.65 4.85 8 7.95l5.35-3.1M8 7.95v6.25" />
    </>
  ),
  penTool: (
    <>
      <path d="m9.9 2.25 3.85 3.85-7.45 7.45-4.1.25.25-4.1 7.45-7.45Z" />
      <path d="m8.75 3.4 3.85 3.85M2.45 9.7l3.85 3.85" />
    </>
  ),
  search: (
    <>
      <circle cx="7.1" cy="7.1" r="4.6" />
      <path d="m10.55 10.55 3.05 3.05" />
    </>
  ),
  user: (
    <>
      <circle cx="8" cy="5.2" r="2.45" />
      <path d="M3.35 13.4c.55-2.35 2.25-3.55 4.65-3.55s4.1 1.2 4.65 3.55" />
    </>
  ),
  globe: (
    <>
      <circle cx="8" cy="8" r="6.1" />
      <path d="M2.4 8h11.2M8 1.9c1.6 1.65 2.35 3.65 2.35 6.1S9.6 12.45 8 14.1C6.4 12.45 5.65 10.45 5.65 8S6.4 3.55 8 1.9Z" />
    </>
  ),
  chevronDown: (
    <path d="m4.2 6.2 3.8 3.7 3.8-3.7" />
  ),
}

function Icon({ name, className = '', size = 18, title }) {
  return (
    <svg
      className={`ss-icon ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.45"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
    >
      {title && <title>{title}</title>}
      {iconPaths[name] || iconPaths.box}
    </svg>
  )
}

export default Icon
