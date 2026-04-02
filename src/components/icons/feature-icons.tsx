import { cn } from "@/lib/utils";

interface IconProps {
  className?: string;
  size?: number;
  color?: string;
}

const defaultProps = (size: number, className?: string) => ({
  width: size,
  height: size,
  viewBox: "0 0 48 48",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  className: cn("shrink-0", className),
});

/** Page editing / content creation */
export function IconPageEdit({ size = 24, color = "currentColor", className }: IconProps) {
  return (
    <svg {...defaultProps(size, className)}>
      <rect x="8" y="6" width="24" height="32" rx="3" stroke={color} strokeWidth="2.5" />
      <path d="M14 14h12M14 20h8" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M30 26l6-6 4 4-6 6H30v-4z" fill={color} opacity="0.2" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

/** Sparkle / optimize / AI improvement */
export function IconSparkle({ size = 24, color = "currentColor", className }: IconProps) {
  return (
    <svg {...defaultProps(size, className)}>
      <path d="M24 4l3 10h10l-8 6 3 10-8-6-8 6 3-10-8-6h10z" fill={color} opacity="0.15" />
      <path d="M24 4l3 10h10l-8 6 3 10-8-6-8 6 3-10-8-6h10z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      <circle cx="36" cy="10" r="3" fill={color} opacity="0.4" />
      <circle cx="38" cy="36" r="2" fill={color} opacity="0.3" />
    </svg>
  );
}

/** Clipboard / candidate management */
export function IconClipboard({ size = 24, color = "currentColor", className }: IconProps) {
  return (
    <svg {...defaultProps(size, className)}>
      <rect x="10" y="10" width="28" height="32" rx="3" stroke={color} strokeWidth="2.5" />
      <rect x="18" y="6" width="12" height="8" rx="2" fill={color} opacity="0.2" stroke={color} strokeWidth="2" />
      <path d="M16 22h16M16 28h12M16 34h8" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** Chart / analytics */
export function IconChart({ size = 24, color = "currentColor", className }: IconProps) {
  return (
    <svg {...defaultProps(size, className)}>
      <rect x="6" y="6" width="36" height="36" rx="4" stroke={color} strokeWidth="2.5" fill="none" />
      <rect x="12" y="26" width="6" height="12" rx="1.5" fill={color} opacity="0.3" />
      <rect x="21" y="18" width="6" height="20" rx="1.5" fill={color} opacity="0.5" />
      <rect x="30" y="12" width="6" height="26" rx="1.5" fill={color} opacity="0.7" />
    </svg>
  );
}

/** User avatar placeholder with initials */
export function UserAvatar({
  name,
  role,
  size = 32,
  className,
}: {
  name: string;
  role?: string;
  size?: number;
  className?: string;
}) {
  const initial = name.charAt(0);
  const isNeco = role?.startsWith("neco");
  const bgColor = isNeco ? "#f59e0b" : "#6366f1";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      role="img"
      aria-label={name}
    >
      <circle cx="20" cy="20" r="20" fill={bgColor} opacity="0.15" />
      <circle cx="20" cy="20" r="18" stroke={bgColor} strokeWidth="1.5" fill="none" />
      <text
        x="20"
        y="26"
        textAnchor="middle"
        fill={bgColor}
        fontWeight="600"
        fontSize="16"
        fontFamily="system-ui, sans-serif"
      >
        {initial}
      </text>
      {isNeco && (
        <circle cx="32" cy="8" r="5" fill="#f59e0b" stroke="white" strokeWidth="2" />
      )}
    </svg>
  );
}
