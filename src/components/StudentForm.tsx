import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAssessmentStore } from "@/lib/store";

export function StudentForm() {
  const student = useAssessmentStore((s) => s.student);
  const setStudent = useAssessmentStore((s) => s.setStudent);

  return (
    <section className="card-elevated p-6">
      <h2 className="font-heading text-lg font-bold">Student Information</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        These details appear on the generated answer document.
      </p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="student-name">Student Name</Label>
          <Input
            id="student-name"
            placeholder="Enter student name"
            value={student.name}
            onChange={(e) => setStudent({ ...student, name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="student-reg">Registration Number</Label>
          <Input
            id="student-reg"
            placeholder="Enter registration number"
            value={student.registrationNumber}
            onChange={(e) => setStudent({ ...student, registrationNumber: e.target.value })}
            required
          />
        </div>
      </div>
    </section>
  );
}
