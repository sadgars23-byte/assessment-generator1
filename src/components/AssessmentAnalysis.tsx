import { Badge } from "@/components/ui/badge";
import type { AssessmentAnalysis as Analysis } from "@/types/assessment";

function Row({ label, value }: { label: string; value: string }) {
  if (!value.trim()) return null;
  return (
    <div className="flex flex-col gap-0.5 border-b border-border/70 py-2 last:border-0 sm:flex-row sm:gap-4">
      <span className="w-44 shrink-0 text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

export function AssessmentAnalysisView({ analysis }: { analysis: Analysis }) {
  return (
    <section className="card-elevated p-6">
      <h2 className="font-heading text-lg font-bold">Assessment Summary</h2>
      <div className="mt-3">
        <Row label="Institution" value={analysis.institution} />
        <Row label="Course" value={analysis.course_name} />
        <Row label="Course Code" value={analysis.course_code} />
        <Row label="Assessment" value={analysis.assessment_type} />
        <Row label="Questions" value={String(analysis.questions.length || analysis.total_questions)} />
        <Row label="Total Marks" value={analysis.total_marks ? String(analysis.total_marks) : ""} />
        <Row label="Course Outcome" value={analysis.course_outcomes.join(", ")} />
        <Row label="Taxonomy" value={analysis.taxonomy} />
        <Row label="Sections" value={analysis.sections.map((s) => s.name).join(", ")} />
      </div>

      {analysis.instructions.length > 0 && (
        <div className="mt-5">
          <h3 className="text-sm font-semibold">Instructions detected</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {analysis.instructions.map((i, idx) => (
              <li key={idx}>{i}</li>
            ))}
          </ul>
        </div>
      )}

      {analysis.rubric.length > 0 && (
        <div className="mt-5">
          <h3 className="text-sm font-semibold">Rubric detected</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {analysis.rubric.map((r, idx) => (
              <Badge key={idx} variant="secondary">
                {r.criterion}
                {r.marks ? ` · ${r.marks}` : ""}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {analysis.tables.length > 0 && (
        <div className="mt-5 space-y-4">
          <h3 className="text-sm font-semibold">Tables analyzed</h3>
          {analysis.tables.map((t, idx) => (
            <div key={idx} className="overflow-x-auto rounded-lg border border-border">
              {t.title ? (
                <p className="border-b border-border bg-muted/50 px-3 py-2 text-xs font-semibold">
                  {t.title}
                </p>
              ) : null}
              <table className="w-full text-left text-xs">
                {t.headers.length > 0 && (
                  <thead className="bg-muted/30">
                    <tr>
                      {t.headers.map((h, i) => (
                        <th key={i} className="px-3 py-2 font-semibold">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                )}
                <tbody>
                  {t.rows.map((row, i) => (
                    <tr key={i} className="border-t border-border/70">
                      {row.map((cell, j) => (
                        <td key={j} className="px-3 py-2 align-top">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
