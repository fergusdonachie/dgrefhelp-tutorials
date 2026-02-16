import { Accordion } from "@/components/ui/Accordion";

type StepProps = {
  title: string;
  open?: boolean;
  children: React.ReactNode;
};

export function Step({ title, open, children }: StepProps) {
  return (
    <Accordion
      title={<strong>{title}</strong>}
      defaultOpen={!!open}
      className="step"
      summaryClassName="step__summary"
      bodyClassName="step__body"
    >
      {children}
    </Accordion>
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
    <Accordion
      title={<strong>{title}</strong>}
      defaultOpen={open}
      className="case"
      summaryClassName="case__summary"
      bodyClassName="case__body"
    >
      {children}
    </Accordion>
  );
}
