type CalloutProps = {
  type?: "note" | "ok" | "warn";
  title?: string;
  children: React.ReactNode;
};

export function Callout({ type = "note", title, children }: CalloutProps) {
  return (
    <aside className={`callout callout--${type}`}>
      {title ? <div className="callout__title">{title}</div> : null}
      <div className="callout__body">{children}</div>
    </aside>
  );
}
