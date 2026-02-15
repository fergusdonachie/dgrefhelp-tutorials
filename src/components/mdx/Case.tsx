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
  return (
    <details className="case" open={open}>
      <summary className="case__summary">
        <strong>{title}</strong>
      </summary>
      <div className="case__body">{children}</div>
    </details>
  );
}
