// PacMan.tsx  — полный круг, рвём рот только clip-pathʼом
export default function PacMan() {
  return (
    <svg
      className="pacman"                // классы Tailwind ниже
      viewBox="0 0 64 64"
      width={32}
      height={32}
    >
      <circle cx="32" cy="32" r="32" fill="yellow" />
    </svg>
  );
}