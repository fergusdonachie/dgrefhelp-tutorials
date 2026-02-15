type StageProps = {
  title: string;
  open?: boolean;
  children: React.ReactNode;
};

export function Stage({ title, open, children }: StageProps) {
  return (
    <details className="stage" open={open}>
      <summary className="stage__summary">
        <strong>{title}</strong>
      </summary>
      <div className="stage__body">{children}</div>
    </details>
  );
}

type CaseProps = {
  title: string;
  children: React.ReactNode;
};

export function Case({ title, children }: CaseProps) {
  return (
    <section className="case">
      <h3 className="case__title">{title}</h3>
      {children}
    </section>
  );
}
