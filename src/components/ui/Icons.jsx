const iconProps = {
  width: 18,
  height: 18,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function IconCloud(props) {
  return (
    <svg {...iconProps} viewBox="0 0 24 24" aria-hidden {...props}>
      <path d="M7 18a4 4 0 0 1 0-8 5 5 0 0 1 9.9-1 3.5 3.5 0 0 1 .1 7H7Z" />
    </svg>
  )
}

export function IconHome(props) {
  return (
    <svg {...iconProps} viewBox="0 0 24 24" aria-hidden {...props}>
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" />
    </svg>
  )
}

export function IconFilm(props) {
  return (
    <svg {...iconProps} viewBox="0 0 24 24" aria-hidden {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M7 5v14M17 5v14M3 10h18M3 14h18" />
    </svg>
  )
}

export function IconCompass(props) {
  return (
    <svg {...iconProps} viewBox="0 0 24 24" aria-hidden {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-5 2-2 5 5-2 2-5Z" />
    </svg>
  )
}

export function IconUsers(props) {
  return (
    <svg {...iconProps} viewBox="0 0 24 24" aria-hidden {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

export function IconMonitor(props) {
  return (
    <svg {...iconProps} viewBox="0 0 24 24" aria-hidden {...props}>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" />
    </svg>
  )
}

export function IconKeyboard(props) {
  return (
    <svg {...iconProps} viewBox="0 0 24 24" aria-hidden {...props}>
      <rect x="3" y="7" width="18" height="10" rx="2" />
      <path d="M7 11h2M11 11h2M15 11h2" />
    </svg>
  )
}

export function IconAudio(props) {
  return (
    <svg {...iconProps} viewBox="0 0 24 24" aria-hidden {...props}>
      <path d="M12 5v14l-4-3H5V8h3l4-3Z" />
      <path d="M16 9a5 5 0 0 1 0 6M18 7a8 8 0 0 1 0 10" />
    </svg>
  )
}

export function IconBolt(props) {
  return (
    <svg {...iconProps} viewBox="0 0 24 24" aria-hidden {...props}>
      <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" />
    </svg>
  )
}

export function IconGear(props) {
  return (
    <svg {...iconProps} viewBox="0 0 24 24" aria-hidden {...props}>
      <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
      <path d="M19.4 15a7.9 7.9 0 0 0 .1-1l2-1.2-2-3.4-2.3.7a7.7 7.7 0 0 0-1.7-1l-.3-2.4H8.9l-.3 2.4a7.7 7.7 0 0 0-1.7 1L4.6 9.4l-2 3.4L4.5 14a8 8 0 0 0 0 2l-2 1.2 2 3.4 2.3-.7a7.7 7.7 0 0 0 1.7 1l.3 2.4h4.4l.3-2.4a7.7 7.7 0 0 0 1.7-1l2.3.7 2-3.4-1.9-1.2Z" />
    </svg>
  )
}

export function IconPlay(props) {
  return (
    <svg {...iconProps} viewBox="0 0 24 24" aria-hidden {...props}>
      <path d="M9 7v10l8-5-8-5Z" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function IconChevron(props) {
  return (
    <svg {...iconProps} viewBox="0 0 24 24" aria-hidden {...props}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  )
}

export function IconHdd(props) {
  return (
    <svg {...iconProps} viewBox="0 0 24 24" aria-hidden {...props}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M8 16h8M8 12h8" />
    </svg>
  )
}

export function IconClock(props) {
  return (
    <svg {...iconProps} viewBox="0 0 24 24" aria-hidden {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v6l4 2" />
    </svg>
  )
}

export function IconStarLogo(props) {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      aria-hidden
      {...props}
    >
      <rect width="36" height="36" rx="10" fill="url(#sg)" />
      <path
        d="M18 8 21.5 16.5 30 18l-8.5 1.5L18 28l-3.5-8.5L6 18l8.5-1.5L18 8Z"
        fill="white"
        fillOpacity="0.95"
      />
      <defs>
        <linearGradient id="sg" x1="8" y1="4" x2="30" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9b7cff" />
          <stop offset="1" stopColor="#5a3ddb" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function IconLock(props) {
  return (
    <svg {...iconProps} viewBox="0 0 24 24" aria-hidden {...props}>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

export function IconSearch(props) {
  return (
    <svg {...iconProps} viewBox="0 0 24 24" aria-hidden {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4.3-4.3" />
    </svg>
  )
}

export function IconGrid(props) {
  return (
    <svg {...iconProps} viewBox="0 0 24 24" aria-hidden {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  )
}

export function IconListMenu(props) {
  return (
    <svg {...iconProps} viewBox="0 0 24 24" aria-hidden {...props}>
      <path d="M8 6h13M8 12h13M8 18h13M4 6h.01M4 12h.01M4 18h.01" />
    </svg>
  )
}

export function IconMoreVertical(props) {
  return (
    <svg {...iconProps} viewBox="0 0 24 24" aria-hidden {...props}>
      <circle cx="12" cy="5" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="12" cy="19" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function IconGamepad(props) {
  return (
    <svg {...iconProps} viewBox="0 0 24 24" aria-hidden {...props}>
      <path d="M6 11h4M8 9v4M15 12h.01M18 10h.01" />
      <rect x="2" y="6" width="20" height="12" rx="4" />
    </svg>
  )
}

export function IconTrending(props) {
  return (
    <svg {...iconProps} viewBox="0 0 24 24" aria-hidden {...props}>
      <path d="M22 7 13.5 15.5 8.5 10.5 2 17" />
      <path d="M16 7h6v6" />
    </svg>
  )
}

export function IconHeart(props) {
  return (
    <svg {...iconProps} viewBox="0 0 24 24" aria-hidden {...props}>
      <path d="M19 14c1.5-1.3 2-3.2 2-5a3.5 3.5 0 0 0-6.7-1.5A3.5 3.5 0 0 0 7 8a5 5 0 0 0 2 4l5 4 5-4Z" />
    </svg>
  )
}

export function IconShare(props) {
  return (
    <svg {...iconProps} viewBox="0 0 24 24" aria-hidden {...props}>
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" />
    </svg>
  )
}

export function IconEye(props) {
  return (
    <svg {...iconProps} viewBox="0 0 24 24" aria-hidden {...props}>
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

export function IconCamera(props) {
  return (
    <svg {...iconProps} viewBox="0 0 24 24" aria-hidden {...props}>
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  )
}

export function IconReset(props) {
  return (
    <svg {...iconProps} viewBox="0 0 24 24" aria-hidden {...props}>
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v4h4" />
    </svg>
  )
}

export function IconMic(props) {
  return (
    <svg {...iconProps} viewBox="0 0 24 24" aria-hidden {...props}>
      <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Z" />
      <path d="M19 10v1a7 7 0 0 1-14 0v-1M12 18v4M8 22h8" />
    </svg>
  )
}

export function IconHeadphones(props) {
  return (
    <svg {...iconProps} viewBox="0 0 24 24" aria-hidden {...props}>
      <path d="M3 18v-6a9 9 0 1 1 18 0v6M3 18a2 2 0 0 0 2 2h1v-8H5a2 2 0 0 0-2 2Zm18 0a2 2 0 0 1-2 2h-1v-8h1a2 2 0 0 1 2 2Z" />
    </svg>
  )
}

export function IconMusic(props) {
  return (
    <svg {...iconProps} viewBox="0 0 24 24" aria-hidden {...props}>
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  )
}

export function IconBrowser(props) {
  return (
    <svg {...iconProps} viewBox="0 0 24 24" aria-hidden {...props}>
      <rect x="3" y="4" width="18" height="14" rx="2" />
      <path d="M3 8h18M8 16h4" />
    </svg>
  )
}

export function IconScissors(props) {
  return (
    <svg {...iconProps} viewBox="0 0 24 24" aria-hidden {...props}>
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="m20 4-7.5 7.5M14 10l2 2M8 18 20 4" />
    </svg>
  )
}

export function IconTrophy(props) {
  return (
    <svg {...iconProps} viewBox="0 0 24 24" aria-hidden {...props}>
      <path d="M8 21h8M12 17v4M7 4h10v3a5 5 0 0 1-10 0V4Z" />
      <path d="M7 4H4a2 2 0 0 0 2 2h1M17 4h3a2 2 0 0 1-2 2h-1" />
    </svg>
  )
}

export function IconStar(props) {
  return (
    <svg {...iconProps} viewBox="0 0 24 24" aria-hidden {...props}>
      <path d="m12 2 2.4 7.4H22l-6 4.6 2.3 7L12 17.8 5.7 21l2.3-7-6-4.6h7.6L12 2Z" />
    </svg>
  )
}

export function IconGlobe(props) {
  return (
    <svg {...iconProps} viewBox="0 0 24 24" aria-hidden {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" />
    </svg>
  )
}

export function IconChip(props) {
  return (
    <svg {...iconProps} viewBox="0 0 24 24" aria-hidden {...props}>
      <rect x="7" y="7" width="10" height="10" rx="2" />
      <path d="M9 3v4M15 3v4M9 17v4M15 17v4M3 9h4M3 15h4M17 9h4M17 15h4" />
    </svg>
  )
}

export function IconGauge(props) {
  return (
    <svg {...iconProps} viewBox="0 0 24 24" aria-hidden {...props}>
      <path d="M12 14v4M4 20h16" />
      <path d="m4 16 3-5 4 2 5-8 4 11" />
    </svg>
  )
}

export function IconVideoCam(props) {
  return (
    <svg {...iconProps} viewBox="0 0 24 24" aria-hidden {...props}>
      <path d="m22 8-4 3v4l4 3V8Z" />
      <rect x="2" y="6" width="14" height="12" rx="2" />
    </svg>
  )
}

export function IconPulse(props) {
  return (
    <svg {...iconProps} viewBox="0 0 24 24" aria-hidden {...props}>
      <path d="M3 12h4l2-7 4 14 2-7h6" />
    </svg>
  )
}

export function IconUpload(props) {
  return (
    <svg {...iconProps} viewBox="0 0 24 24" aria-hidden {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  )
}



