import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import FormCard from "../../components/ui/FormCard";
import { QC_CHECKLIST } from "../../data/qcChecklist";
import { qcService } from "../../services/storage";

const today = () => new Date().toISOString().slice(0, 10);

const initialState = () => ({
  itemName: "",
  batchId: "",
  inspectionDate: today(),
  serialBody: "",
  serialSoft: "",
  checks: QC_CHECKLIST.map(() => ({ result: "", comment: "" })),
  workingPorts: "",
  totalPorts: "",
  summary: "",
});

const Field = ({ label, children }) => (
  <label className="block text-xs font-bold text-slate-600">
    {label}
    <div className="mt-1 font-normal">{children}</div>
  </label>
);

export default function QcForm() {
  const { user } = useAuth();
  const [form, setForm] = useState(initialState);
  const [message, setMessage] = useState(null);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });
  const setCheck = (i, patch) =>
    setForm({
      ...form,
      checks: form.checks.map((c, idx) => (idx === i ? { ...c, ...patch } : c)),
    });

  const submit = (e, decision) => {
    e.preventDefault();
    const missing = form.checks.findIndex((c) => !c.result);
    if (missing !== -1)
      return setMessage({
        type: "error",
        text: `Select Pass/Fail for point #${missing + 1}`,
      });
    const noComment = form.checks.findIndex(
      (c) => c.result === "fail" && !c.comment.trim(),
    );
    if (noComment !== -1)
      return setMessage({
        type: "error",
        text: `Comment required for failed point #${noComment + 1}`,
      });
    const hasFail = form.checks.some((c) => c.result === "fail");
    if (decision === "PASS" && hasFail)
      return setMessage({
        type: "error",
        text: "Cannot pass: some checks failed.",
      });

    qcService.save({
      ...form,
      decision,
      inspectedBy: user.name,
      createdAt: new Date().toISOString(),
    });
    setMessage({ type: "success", text: `Inspection saved as ${decision}.` });
    setForm(initialState());
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <FormCard title="Laptop Quality Inspection (32 Points)">
      {message && (
        <div
          className={`mb-4 rounded-md p-3 text-center text-sm font-semibold ${
            message.type === "error"
              ? "bg-red-100 text-red-700"
              : "bg-emerald-100 text-emerald-700"
          }`}
        >
          {message.text}
        </div>
      )}
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 md:grid-cols-4">
          <Field label="Item Name">
            <input
              className="input"
              required
              value={form.itemName}
              onChange={set("itemName")}
            />
          </Field>
          <Field label="Batch ID">
            <input
              className="input"
              required
              value={form.batchId}
              onChange={set("batchId")}
            />
          </Field>
          <Field label="Inspection Date">
            <input
              type="date"
              className="input"
              value={form.inspectionDate}
              onChange={set("inspectionDate")}
            />
          </Field>
          <Field label="Inspected By">
            <input className="input" value={user.name} readOnly />
          </Field>
          <div className="md:col-span-2">
            <Field label="Serial Number - Body (Physical)">
              <input
                className="input"
                placeholder="Check Sticker"
                value={form.serialBody}
                onChange={set("serialBody")}
              />
            </Field>
          </div>
          <div className="md:col-span-2">
            <Field label="Serial Number - Soft (BIOS/OS)">
              <input
                className="input"
                placeholder="Check System"
                value={form.serialSoft}
                onChange={set("serialSoft")}
              />
            </Field>
          </div>
        </div>

        <div className="mt-8 mb-3 border-b border-slate-200 pb-2 text-sm font-semibold text-slate-800">
          Visual &amp; Hardware Checklist
        </div>
        <div className="overflow-x-auto rounded-md border border-slate-200">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-slate-50 text-xs font-semibold text-slate-500">
              <tr>
                <th className="w-10 p-2">#</th>
                <th className="p-2 text-left">Inspection Parameter</th>
                <th className="w-16 p-2">Pass</th>
                <th className="w-16 p-2">Fail</th>
                <th className="p-2">Comments (Required if Fail)</th>
              </tr>
            </thead>
            <tbody>
              {QC_CHECKLIST.map((label, i) => {
                const c = form.checks[i];
                return (
                  <tr
                    key={label}
                    className={`border-t border-slate-200 ${c.result === "fail" ? "bg-red-50/60" : ""}`}
                  >
                    <td className="p-2 text-center font-semibold">{i + 1}</td>
                    <td className="p-2">{label}</td>
                    {["pass", "fail"].map((r) => (
                      <td key={r} className="p-2 text-center">
                        <input
                          type="radio"
                          name={`check-${i}`}
                          checked={c.result === r}
                          onChange={() => setCheck(i, { result: r })}
                        />
                      </td>
                    ))}
                    <td className="p-2">
                      <input
                        className="input"
                        placeholder="Remarks"
                        value={c.comment}
                        onChange={(e) =>
                          setCheck(i, { comment: e.target.value })
                        }
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-wrap gap-6 rounded-md border border-slate-200 bg-slate-50 p-4">
          <Field label="Working Ports">
            <input
              type="number"
              min="0"
              className="input"
              value={form.workingPorts}
              onChange={set("workingPorts")}
            />
          </Field>
          <Field label="Total Ports">
            <input
              type="number"
              min="0"
              className="input"
              value={form.totalPorts}
              onChange={set("totalPorts")}
            />
          </Field>
        </div>

        <div className="mt-6">
          <Field label="Final Summary / Additional Issues">
            <textarea
              className="input"
              rows={3}
              placeholder="Enter final inspection notes here..."
              value={form.summary}
              onChange={set("summary")}
            />
          </Field>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            className="btn-primary py-3"
            onClick={(e) => submit(e, "PASS")}
          >
            ✔ Everything OK - Pass
          </button>
          <button
            type="button"
            className="btn-danger py-3"
            onClick={(e) => submit(e, "REJECT")}
          >
            ✘ Issues Found - Reject
          </button>
        </div>
      </form>
    </FormCard>
  );
}
