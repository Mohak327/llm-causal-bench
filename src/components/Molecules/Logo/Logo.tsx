export const LogoMark = ({ className = "h-8 w-8" }: { className?: string }) => (
  <svg viewBox="0 0 32 32" className={className} aria-hidden fill="none">
    <path
      d="M12 12 L19.5 8 L13 3.4"
      stroke="#4E66B8"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="2.1" fill="#1D3A9E" />
    <circle cx="19.5" cy="8" r="2.1" fill="#1D3A9E" />
    <circle cx="13" cy="3.4" r="2.1" fill="#C8862A" />
    <path
      d="M5 15.5 H25 C25 22.5 21 27 15 27 C9 27 5 22.5 5 15.5 Z"
      fill="#1D3A9E"
    />
    <path d="M7.6 18.6 H22.4" stroke="#EEF1F5" strokeOpacity="0.55" strokeWidth="1.2" strokeLinecap="round" />
    <path
      d="M24.4 17.3 C29 17.1 29 23.3 22.7 23.6"
      stroke="#1D3A9E"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path d="M3.5 29.6 H26.5" stroke="#1D3A9E" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
