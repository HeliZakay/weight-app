/**
 * Inline SVG icons rebuilt from the design prototype. All use
 * `stroke="currentColor"` (unless a fill is intrinsic) so color is driven by
 * the parent — matching the nav's active/inactive behavior.
 */
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 22, ...props }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    ...props,
  };
}

export function HomeIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path
        d="M4 11l8-7 8 7v8a1 1 0 01-1 1h-5v-5h-4v5H5a1 1 0 01-1-1z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ChartIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path
        d="M4 18l5-6 4 3 6-8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TargetIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="2.5" fill="currentColor" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base({ size: 18, ...props })}>
      <path
        d="M5 13l4 4 10-10"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ScaleIcon(props: IconProps) {
  // dashed-circle "weigh in" glyph
  return (
    <svg {...base({ size: 18, ...props })}>
      <path
        d="M12 3a9 9 0 109 9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M12 12l4-4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MovePlusIcon(props: IconProps) {
  return (
    <svg {...base({ size: 18, ...props })}>
      <path
        d="M6 12h12M12 6v12"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ForkKnifeIcon(props: IconProps) {
  return (
    <svg {...base({ size: 18, ...props })}>
      <path
        d="M5 4v16M8 4v6a3 3 0 01-3 3M16 4c-1.5 0-2.5 2-2.5 5s1 4 2.5 4m0 0v7m0-7l0-9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ChevronIcon(props: IconProps) {
  return (
    <svg {...base({ size: 20, ...props })}>
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DownloadIcon(props: IconProps) {
  return (
    <svg {...base({ size: 20, ...props })}>
      <path
        d="M12 3v12M12 15l-4-4M12 15l4-4M5 19h14"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
