"use client";

import { useState } from "react";

/**
 * Interactive footer actions for a Work Receipt: copy the public link and
 * download (print) the receipt. The receipt itself is server-rendered; only
 * these controls need the client.
 */
export function ReceiptActions({ explorerUrl }: { explorerUrl: string }) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  return (
    <div className="noprint flex flex-wrap gap-[18px] font-mono text-[11.5px]">
      <button type="button" onClick={copyLink} className="text-text-muted transition-colors hover:text-text">
        {copied ? "Copied" : "Copy link"}
      </button>
      <a href={explorerUrl} target="_blank" rel="noreferrer" className="text-text-muted transition-colors hover:text-text">
        View on-chain record
      </a>
      <button type="button" onClick={() => window.print()} className="text-text-muted transition-colors hover:text-text">
        Download receipt
      </button>
    </div>
  );
}
