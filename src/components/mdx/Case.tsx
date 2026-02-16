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

  function closeWithoutJump() {
    const summary = summaryRef.current;
    if (!summary) {
      setIsOpen(false);
      return;
    }

    // Keep the summary visually anchored in the viewport after collapse by
    // compensating for the layout height change.
    const beforeTop = summary.getBoundingClientRect().top;
    const beforeScrollY = window.scrollY;

    setIsOpen(false);

    requestAnimationFrame(() => {
      const afterTop = summary.getBoundingClientRect().top;
      const delta = afterTop - beforeTop;
      if (Math.abs(delta) > 1) {
        window.scrollTo({ top: beforeScrollY + delta });
      }
    });
  }

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

        // If the user opened via native toggle, just reflect state.
        if (el.open) {
          setIsOpen(true);
          return;
        }

        // If the user closed via native toggle (e.g. keyboard), do our anchored close.
        closeWithoutJump();
      }}
    >
      <summary
        className="case__summary"
        ref={(node) => {
          summaryRef.current = node;
        }}
        onClick={(e) => {
          // Intercept mouse/touch close to avoid scroll jump.
          if (isOpen) {
            e.preventDefault();
            closeWithoutJump();
          }
        }}
      >
        <strong>{title}</strong>
      </summary>
      <div className="case__body">{children}</div>
    </details>
  );
}
