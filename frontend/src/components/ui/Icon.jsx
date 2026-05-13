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
