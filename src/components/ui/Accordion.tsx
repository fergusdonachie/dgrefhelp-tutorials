"use client";

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";

type AccordionProps = {
  title: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  summaryClassName?: string;
  bodyClassName?: string;
  children: React.ReactNode;
};

export function Accordion({
  title,
  defaultOpen = false,
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

  const bodyInnerRef = useRef<HTMLDivElement | null>(null);

  // Measure content height.
  const measure = () => {
    const el = bodyInnerRef.current;
    if (!el) return;
    const h = el.scrollHeight;
    setHeightPx(h);
  };

  // Measure on mount and when children change.
  useLayoutEffect(() => {
    measure();
  }, [children]);

  // Measure on window resize.
  useEffect(() => {
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <section className={className}>
      <button
        id={buttonId}
        className={summaryClassName}
        type="button"
        aria-expanded={open}
        aria-controls={regionId}
        onClick={() => setOpen((v) => !v)}
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
