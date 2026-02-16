"use client";

import { useRef, useState } from "react";

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
  const [isOpen, setIsOpen] = useState(open);
  const detailsRef = useRef<HTMLDetailsElement | null>(null);
  const summaryRef = useRef<HTMLElement | null>(null);
  const didHydrateRef = useRef(false);

  return (
    <details
      className="case"
      ref={(node) => {
        detailsRef.current = node;
      }}
      open={isOpen}
      onToggle={(e) => {
        const el = e.currentTarget;

        // Some browsers can fire a toggle-like transition during hydration.
        // Ignore the first one to avoid unexpected scrolling.
        if (!didHydrateRef.current) {
          didHydrateRef.current = true;
          setIsOpen(el.open);
          return;
        }

        setIsOpen(el.open);

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
        onClick={(e) => {
          // If this click would close the case, prevent default so we can
          // scroll to the title first, then close.
          if (isOpen) {
            e.preventDefault();
            summaryRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
            requestAnimationFrame(() => setIsOpen(false));
          }
        }}
      >
        <strong>{title}</strong>
      </summary>
      <div className="case__body">{children}</div>
    </details>
  );
}
