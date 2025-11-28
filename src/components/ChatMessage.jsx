import React from "react";

export default function ChatMessage({ role, content, muted = false }) {
  const base =
    "max-w-[85%] px-4 py-2 rounded-2xl whitespace-pre-line text-sm";

  if (role === "user") {
    return (
      <div
        className={`${base} ml-auto bg-[var(--color-primary)] text-[var(--color-onprimary)]`}
      >
        {content}
      </div>
    );
  }

  return (
    <div
      className={`${base} bg-[var(--color-background)] text-[var(--color-text)] ${
        muted ? "text-[color:var(--color-muted)] italic" : ""
      }`}
    >
      {content}
    </div>
  );
}
