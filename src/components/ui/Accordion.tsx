"use client";

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";

type AccordionProps = {
  title: React.ReactNode;
  defaultOpen?: boolean;
  /**
   * When closing, keep the header visually anchored by compensating scroll.
   * Helps avoid the "page jumps" feeling when collapsing large content.
   */
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
  const regionId = useMemo(() => `acc-region-${id}`, [id]);
  const buttonId = useMemo(() => `acc-button-${id}`, [id]);

  const [open, setOpen] = useState(defaultOpen);
  const [heightPx, setHeightPx] = useState<number>(0);

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const bodyInnerRef = useRef<HTMLDivElement | null>(null);

  // Measure content height.
  const measure = () => {
    const el = bodyInnerRef.current;
    if (!el) return;
    setHeightPx(el.scrollHeight);
  };

  // Keep height in sync with dynamic content changes (e.g. nested accordions opening).
  useLayoutEffect(() => {
    measure();

    const el = bodyInnerRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => {
      measure();
    });
    ro.observe(el);

    return () => {
      ro.disconnect();
    };
  }, [children]);

  // Measure on window resize.
  useEffect(() => {
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const toggle = (next: boolean) => {
    if (!anchorOnClose || next) {
      setOpen(next);
      return;
    }

    // Anchor the button position in the viewport while collapsing.
    const btn = buttonRef.current;
    if (!btn) {
      setOpen(false);
      return;
    }

    const beforeTop = btn.getBoundingClientRect().top;
    const beforeScrollY = window.scrollY;

    setOpen(false);

    requestAnimationFrame(() => {
      const afterTop = btn.getBoundingClientRect().top;
      const delta = afterTop - beforeTop;
      if (Math.abs(delta) > 1) {
        window.scrollTo({ top: beforeScrollY + delta });
      }
    });
  };

  return (
    <section className={className}>
      <button
        id={buttonId}
        ref={(node) => {
          buttonRef.current = node;
        }}
        className={summaryClassName}
        type="button"
        aria-expanded={open}
        aria-controls={regionId}
        onClick={() => toggle(!open)}
      >
        {title}
      </button>

      <div
        id={regionId}
        role="region"
        aria-labelledby={buttonId}
        className={bodyClassName}
        style={{
          maxHeight: open ? `${heightPx}px` : "0px",
          overflow: "hidden",
          transition: "max-height 220ms ease",
        }}
      >
        <div ref={bodyInnerRef}>{children}</div>
      </div>
    </section>
  );
}
