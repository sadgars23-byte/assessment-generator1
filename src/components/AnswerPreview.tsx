import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import type { QuestionAnswer } from "@/types/assessment";

export function AnswerPreview({
  item,
  editing,
  draft,
  onDraftChange,
}: {
  item: QuestionAnswer;
  editing: boolean;
  draft: string;
  onDraftChange: (value: string) => void;
}) {
  const { answer, validation } = item;

  return (
    <div className="space-y-4">
      {validation && (
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={validation.passed ? "secondary" : "destructive"}>
            {validation.passed ? "Validation passed" : "Validation flagged"}
          </Badge>
          <span className="text-xs text-muted-foreground">Score: {validation.score}/100</span>
          {validation.issues.slice(0, 3).map((issue, i) => (
            <span key={i} className="text-xs text-muted-foreground">
              · {issue}
            </span>
          ))}
        </div>
      )}

      {editing ? (
        <Textarea
          value={draft}
          onChange={(e) => onDraftChange(e.target.value)}
          className="min-h-72 font-mono text-xs"
        />
      ) : (
        <div className="whitespace-pre-wrap text-sm leading-relaxed">
          {answer.answer_markdown.replace(/\*\*/g, "")}
        </div>
      )}

      {answer.table && (answer.table.headers.length > 0 || answer.table.rows.length > 0) && (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40">
              <tr>
                {answer.table.headers.map((h, i) => (
                  <th key={i} className="px-3 py-2 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {answer.table.rows.map((row, i) => (
                <tr key={i} className="border-t border-border/70">
                  {row.map((c, j) => (
                    <td key={j} className="px-3 py-2 align-top">
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {answer.diagram && answer.diagram.nodes.length > 0 && (
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Diagram · {answer.diagram.kind}
          </p>
          <p className="mt-1 text-sm font-medium">{answer.diagram.title}</p>
          <div className="mt-3 space-y-2">
            {[...new Set(answer.diagram.nodes.map((n) => n.layer))]
              .sort((a, b) => a - b)
              .map((layer) => (
                <div key={layer} className="flex flex-wrap justify-center gap-2">
                  {answer.diagram!.nodes
                    .filter((n) => n.layer === layer)
                    .map((n) => (
                      <span
                        key={n.id}
                        className="rounded-md border border-primary/40 bg-card px-3 py-1.5 text-center text-xs font-medium text-primary"
                      >
                        {n.label}
                      </span>
                    ))}
                </div>
              ))}
          </div>
        </div>
      )}

      {answer.code && answer.code.source && (
        <div className="space-y-2">
          {answer.code.algorithm.length > 0 && (
            <ol className="list-decimal space-y-1 pl-5 text-sm">
              {answer.code.algorithm.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          )}
          <pre className="overflow-x-auto rounded-lg bg-surface-ink p-4 text-xs leading-relaxed text-primary-foreground">
            <code>{answer.code.source}</code>
          </pre>
          {(answer.code.sample_input || answer.code.sample_output) && (
            <p className="text-xs text-muted-foreground">
              Sample I/O: {answer.code.sample_input} → {answer.code.sample_output}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
