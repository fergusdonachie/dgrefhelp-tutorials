"use client";

import { useRef } from "react";

type StepProps = {
  title: string;
  open?: boolean;
  children: React.ReactNode;
};

export function Step({ title, open, children }: StepProps) {
  return (
    <details className="step" open={open}>
      <summary className="step__summary">
        <strong>{title}</strong>
      </summary>
      <div className="step__body">{children}</div>
    </details>
  );
}

// Back-compat alias (older content used <Stage>)
export const Stage = Step;

type CaseProps = {
  title: string;
  open?: boolean;
  children: React.ReactNode;
};

export function Case({ title, open = false, children }: CaseProps) {
  const summaryRef = useRef<HTMLElement | null>(null);

  return (
    <details
      className="case"
      open={open}
      onToggle={(e) => {
        const el = e.currentTarget;
        // When collapsing, scroll the summary back into view so the page doesn't
        // appear to "jump" upward to an arbitrary position.
        if (!el.open) {
          summaryRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
        }
      }}
    >
      <summary
        className="case__summary"
        ref={(node) => {
          summaryRef.current = node;
        }}
      >
        <strong>{title}</strong>
      </summary>
      <div className="case__body">{children}</div>
    </details>
  );
}
