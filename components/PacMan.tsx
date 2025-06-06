// components/PacMan.tsx
export default function PacMan() {
  return (
    <svg
      className="pacman"
      width={32}
      height={32}
      viewBox="0 0 64 64"
      fill="yellow"
    >
      {/* «рот» закрывается/открывается за счёт clip-path */}
      <path d="M32 0 A32 32 0 1 0 32 64 L64 32 Z" />
    </svg>
  );
}