import { cn } from "@/lib/utils";

interface ClinicLogoProps {
  clinicId: string;
  className?: string;
  size?: number;
  color?: string;
}

/**
 * SVG logos for each clinic — professional vector designs
 */
export function ClinicLogo({ clinicId, className, size = 32, color }: ClinicLogoProps) {
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 48 48",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    className: cn("shrink-0", className),
  };

  switch (clinicId) {
    // Medical Frontier Shibuya — modern cross + pulse line
    case "clinic-1":
      return (
        <svg {...props}>
          <rect x="18" y="8" width="12" height="32" rx="3" fill={color || "#2563eb"} />
          <rect x="8" y="18" width="32" height="12" rx="3" fill={color || "#2563eb"} />
          <path
            d="M8 24h8l3-6 4 12 3-8 2 4h12"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    // Sakura Home Care — house + heart
    case "clinic-2":
      return (
        <svg {...props}>
          <path
            d="M24 6L6 22h6v18h24V22h6L24 6z"
            fill={color || "#e11d48"}
            opacity="0.15"
          />
          <path
            d="M24 8L8 22h4v16h24V22h4L24 8z"
            stroke={color || "#e11d48"}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M24 38V28"
            stroke={color || "#e11d48"}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M24 22c-1.5-3-5-3.5-6-1s1 5 6 8c5-3 7.5-5.5 6-8s-4.5-2-6 1z"
            fill={color || "#e11d48"}
          />
        </svg>
      );

    // Neuroscience Tokyo — brain/neural network
    case "clinic-3":
      return (
        <svg {...props}>
          <circle cx="24" cy="24" r="16" fill={color || "#7c3aed"} opacity="0.1" />
          <circle cx="24" cy="24" r="16" stroke={color || "#7c3aed"} strokeWidth="2.5" fill="none" />
          <circle cx="24" cy="16" r="2.5" fill={color || "#7c3aed"} />
          <circle cx="16" cy="26" r="2.5" fill={color || "#7c3aed"} />
          <circle cx="32" cy="26" r="2.5" fill={color || "#7c3aed"} />
          <circle cx="20" cy="34" r="2" fill={color || "#7c3aed"} />
          <circle cx="28" cy="34" r="2" fill={color || "#7c3aed"} />
          <path
            d="M24 16v4M24 20l-6 5M24 20l6 5M18 27l2 6M30 27l-2 6"
            stroke={color || "#7c3aed"}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M16 26h16"
            stroke={color || "#7c3aed"}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="2 3"
          />
        </svg>
      );

    // Fallback — generic medical cross
    default:
      return (
        <svg {...props}>
          <rect x="19" y="10" width="10" height="28" rx="2" fill={color || "#64748b"} />
          <rect x="10" y="19" width="28" height="10" rx="2" fill={color || "#64748b"} />
        </svg>
      );
  }
}

/**
 * NEXOS platform logo — "N" in a rounded square
 */
export function NexosLogo({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
    >
      <rect width="48" height="48" rx="12" fill="#0f172a" />
      <path
        d="M15 34V14h3.5l11 14.5V14H33v20h-3.5L18.5 19.5V34H15z"
        fill="white"
      />
    </svg>
  );
}
