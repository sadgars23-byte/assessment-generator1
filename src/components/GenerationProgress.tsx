import { Check, CircleDashed, LoaderCircle, TriangleAlert } from "lucide-react";
import { PIPELINE_STEPS, useAssessmentStore } from "@/lib/store";

export function GenerationProgress() {
  const steps = useAssessmentStore((s) => s.steps);
  const note = useAssessmentStore((s) => s.progressNote);

  return (
    <section className="card-elevated p-6">
      <h2 className="font-heading text-lg font-bold">Progress</h2>
      {note ? <p className="mt-1 text-sm text-muted-foreground">{note}</p> : null}
      <ul className="mt-4 space-y-1.5">
        {PIPELINE_STEPS.map((step) => {
          const state = steps[step.id] ?? "pending";
          return (
            <li key={step.id} className="flex items-center gap-3 text-sm">
              {state === "done" && <Check className="size-4 text-success" />}
              {state === "active" && <LoaderCircle className="size-4 animate-spin text-primary" />}
              {state === "pending" && <CircleDashed className="size-4 text-muted-foreground/60" />}
              {state === "error" && <TriangleAlert className="size-4 text-destructive" />}
              <span
                className={
                  state === "pending"
                    ? "text-muted-foreground"
                    : state === "error"
                      ? "text-destructive"
                      : "text-foreground"
                }
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
