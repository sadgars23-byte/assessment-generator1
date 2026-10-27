import { useState } from "react";
import { LoaderCircle, RefreshCw, Save, SquarePen } from "lucide-react";
import { toast } from "sonner";
import { AnswerPreview } from "@/components/AnswerPreview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { regenerateQuestion } from "@/lib/pipeline";
import { useAssessmentStore } from "@/lib/store";

export function QuestionList() {
  const answers = useAssessmentStore((s) => s.answers);
  const updateAnswer = useAssessmentStore((s) => s.updateAnswer);
  const setFinalPdf = useAssessmentStore((s) => s.setFinalPdf);
  const [busy, setBusy] = useState<number | null>(null);
  const [editing, setEditing] = useState<number | null>(null);
  const [draft, setDraft] = useState("");

  async function regenerate(index: number, what: "answer" | "diagram") {
    setBusy(index);
    try {
      await regenerateQuestion(index);
      toast.success(what === "diagram" ? "Diagram regenerated" : "Answer regenerated");
    } catch {
      toast.error(
        what === "diagram"
          ? "Diagram generation failed. Regenerate the diagram."
          : "Answer generation failed. Please try again.",
      );
    } finally {
      setBusy(null);
    }
  }

  return (
    <section className="card-elevated p-6">
      <h2 className="font-heading text-lg font-bold">Questions &amp; Answers</h2>
      <Accordion type="single" collapsible className="mt-3">
        {answers.map((item, index) => {
          const q = item.question;
          const artifacts = [
            q.requires_diagram || q.requires_concept_map ? "Visual" : null,
            q.requires_code ? "Code" : null,
            q.requires_table ? "Table" : null,
            q.requires_formula ? "Formula" : null,
          ].filter(Boolean) as string[];

          return (
            <AccordionItem key={`${q.question_number}-${index}`} value={`q-${index}`}>
              <AccordionTrigger className="text-left">
                <div className="flex flex-1 flex-wrap items-center gap-2 pr-3">
                  <span className="font-heading font-bold">Q{q.question_number}</span>
                  <span className="line-clamp-1 flex-1 text-sm font-normal text-muted-foreground">
                    {q.question_text}
                  </span>
                  <Badge variant="secondary">Marks: {q.marks}</Badge>
                  {q.question_type[0] && <Badge variant="outline">{q.question_type[0]}</Badge>}
                  {q.answer_depth && <Badge variant="outline">Depth: {q.answer_depth}</Badge>}
                  {artifacts.map((a) => (
                    <Badge key={a} variant="outline">
                      {a}
                    </Badge>
                  ))}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <AnswerPreview
                  item={item}
                  editing={editing === index}
                  draft={draft}
                  onDraftChange={setDraft}
                />
                <div className="mt-4 flex flex-wrap gap-2">
                  {editing === index ? (
                    <Button
                      size="sm"
                      onClick={() => {
                        updateAnswer(index, {
                          ...item,
                          answer: { ...item.answer, answer_markdown: draft },
                        });
                        setFinalPdf(null);
                        setEditing(null);
                        toast.success("Answer updated");
                      }}
                    >
                      <Save className="size-4" /> Save answer
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setDraft(item.answer.answer_markdown);
                        setEditing(index);
                      }}
                    >
                      <SquarePen className="size-4" /> Edit answer
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={busy === index}
                    onClick={() => void regenerate(index, "answer")}
                  >
                    {busy === index ? (
                      <LoaderCircle className="size-4 animate-spin" />
                    ) : (
                      <RefreshCw className="size-4" />
                    )}
                    Regenerate answer
                  </Button>
                  {(q.requires_diagram || q.requires_concept_map) && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={busy === index}
                      onClick={() => void regenerate(index, "diagram")}
                    >
                      <RefreshCw className="size-4" /> Regenerate diagram
                    </Button>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </section>
  );
}
