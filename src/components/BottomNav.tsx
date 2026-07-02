"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, PlusIcon, ChartIcon, TargetIcon } from "./icons";

const TABS = [
  { href: "/", label: "Today", Icon: HomeIcon },
  { href: "/log", label: "Log", Icon: PlusIcon },
  { href: "/progress", label: "Progress", Icon: ChartIcon },
  { href: "/goals", label: "Goals", Icon: TargetIcon },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-surface border-hairline flex flex-none items-center justify-around border-t px-5 pt-3 pb-[max(26px,env(safe-area-inset-bottom))]">
      {TABS.map(({ href, label, Icon }) => {
        const active =
          href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center gap-1 ${
              active ? "text-clay" : "text-ink-faint"
            }`}
          >
            <Icon size={22} />
            <span className="text-[11px] font-semibold">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
