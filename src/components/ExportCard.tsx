"use client";

import { useState } from "react";
import { DownloadIcon } from "./icons";

/** Downloads all entries as CSV (via /api/export) and flips its label. */
export default function ExportCard() {
  const [exported, setExported] = useState(false);

  return (
    <a
      href="/api/export"
      download="companion-entries.csv"
      onClick={() => setExported(true)}
      className="bg-surface border-hairline-card rounded-card-lg flex items-center justify-between border p-[18px_20px]"
    >
      <div>
        <div className="text-ink text-[15px] font-semibold">Export my data</div>
        <div className="text-ink-muted mt-0.5 text-[13px]">
          {exported
            ? "Exported ✓ — check your files"
            : "Download all entries as CSV"}
        </div>
      </div>
      <span className="text-ink-muted">
        <DownloadIcon />
      </span>
    </a>
  );
}
