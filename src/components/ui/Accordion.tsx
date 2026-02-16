"use client";

import { useEffect, useId, useRef, useState } from "react";

type AccordionProps = {
  title: React.ReactNode;
  defaultOpen?: boolean;
  anchorOnClose?: boolean;
  className?: string;
  summaryClassName?: string;
  bodyClassName?: string;
  children: React.ReactNode;
};

export function Accordion({
  title,
  defaultOpen = false,
  anchorOnClose = true,
  className,
  summaryClassName,
  bodyClassName,
  children,
}: AccordionProps) {
  const id = useId();
  const regionId = `acc-region-${id}`;
  const buttonId = `acc-button-${id}`;

  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isAnimating, setIsAnimating] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // We use a ref to track the previous open state to detect toggles
  const prevOpenRef = useRef(defaultOpen);

  useEffect(() => {
    if (prevOpenRef.current === isOpen) return;
    prevOpenRef.current = isOpen;

    const el = contentRef.current;
    const btn = buttonRef.current;
    if (!el) return;

    setIsAnimating(true);

    // If closing, we might want to anchor scroll
    let startY = 0;
    let startTop = 0;
    const shouldAnchor = anchorOnClose && !isOpen && btn;

    if (shouldAnchor && btn) {
      startY = window.scrollY;
      startTop = btn.getBoundingClientRect().top;
    }

    // Animation logic
    if (isOpen) {
      // OPENING: 0 -> height
      // 1. Set height to 0 (should already be there, but ensure it)
      el.style.height = "0px";
      // 2. Force reflow
      void el.offsetHeight;
      // 3. Set to scrollHeight
      el.style.height = `${el.scrollHeight}px`;
    } else {
      // CLOSING: height -> 0
      // 1. Set height to current scrollHeight (explicitly) to start transition
      el.style.height = `${el.scrollHeight}px`;
      // 2. Force reflow
      void el.offsetHeight;
      // 3. Set to 0
      el.style.height = "0px";
    }

    const onTransitionEnd = () => {
      setIsAnimating(false);
      if (isOpen) {
        // Remove height limit so content can grow/shrink freely (fixes "cut off" bug)
        el.style.height = "auto";
      }
      el.removeEventListener("transitionend", onTransitionEnd);
    };

    el.addEventListener("transitionend", onTransitionEnd);

    // Scroll correction for closing
    if (shouldAnchor && btn) {
      // We check immediately after the layout change (start of animation)
      requestAnimationFrame(() => {
        const currentTop = btn.getBoundingClientRect().top;
        const delta = currentTop - startTop;
        // If the header moved significantly, scroll to put it back
        if (Math.abs(delta) > 1) {
          window.scrollTo({
            top: startY + delta,
            behavior: "instant", // Instant correction, don't smooth scroll the correction
          });
        }
      });
    }

    return () => {
      el.removeEventListener("transitionend", onTransitionEnd);
    };
  }, [isOpen, anchorOnClose]);

  return (
    <section className={className}>
      <button
        ref={buttonRef}
        id={buttonId}
        className={summaryClassName}
        type="button"
        aria-expanded={isOpen}
        aria-controls={regionId}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {title}
      </button>

      <div
        id={regionId}
        role="region"
        aria-labelledby={buttonId}
        className={bodyClassName}
        ref={contentRef}
        style={{
          // If open and not animating, height is auto (from effect)
          // If closed and not animating, height is 0
          // If animating, the effect handles inline styles
          height: isOpen && !isAnimating ? "auto" : undefined,
          overflow: "hidden",
          transition: "height 250ms cubic-bezier(0.4, 0, 0.2, 1)",
          // Initial state for SSR (if defaultOpen=false)
          ...(!isOpen && !isAnimating ? { height: "0px" } : {}),
        }}
      >
        {/* We don't need the inner div ref for measurement anymore, logic is on the container */}
        <div>{children}</div>
      </div>
    </section>
  );
}
