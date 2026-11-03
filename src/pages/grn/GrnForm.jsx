import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import FormCard from "../../components/ui/FormCard";
import FormField from "../../components/ui/FormField";
import SectionHeader from "../../components/ui/SectionHeader";
import { COURIERS, PACKAGING_STATUS, WAREHOUSES } from "../../data/qcChecklist";
import { grnService } from "../../services/storage";
import ItemRows from "./ItemRows";

const today = () => new Date().toISOString().slice(0, 10);

const initialState = () => {
  const grnNumber = grnService.nextNumber();
  return {
    grnNumber,
    vendorName: "",
    vendorId: "",
    contactPerson: "",
    invoiceNumber: "",
    invoiceDate: "",
    lrNumber: "",
    courier: "",
    dispatchDate: "",
    deliveryDate: today(),
    grnDate: today(),
    warehouse: "",
    poNumber: "",
    poDate: "",
    items: [{ name: "", serial: "", qty: 1 }],
    packagingStatus: "",
    damageRemarks: "",
    invoiceFile: "",
    photos: "",
    courierReceipt: "",
    qcStatus: "Pending",
    qcAssignedTo: "Auto Logic",
    qcDeadline: "24–48 hours",
    qcBatchId: grnNumber.replace("GRN", "BATCH"),
    remarks: "",
  };
};

export default function GrnForm() {
  const { user } = useAuth();
  const [form, setForm] = useState(initialState);
  const [saved, setSaved] = useState(false);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });
  const setFile = (field) => (e) =>
    setForm({
      ...form,
      [field]: [...e.target.files].map((f) => f.name).join(", "),
    });

  const text = (field, props = {}) => (
    <input
      className="input"
      value={form[field]}
      onChange={set(field)}
      {...props}
    />
  );
  const select = (field, options, placeholder) => (
    <select
      className="input"
      value={form[field]}
      onChange={set(field)}
      required
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  );

  const submit = (e) => {
    e.preventDefault();
    grnService.save({
      ...form,
      receivedBy: user.name,
      createdAt: new Date().toISOString(),
      // each item row produces its own pending QC entry
      qcEntries: form.items.map((it, i) => ({
        ...it,
        qcId: `${form.qcBatchId}-${i + 1}`,
        status: "Pending",
      })),
    });
    setSaved(true);
    setForm(initialState());
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <FormCard title="Goods Received Note (GRN)">
      {saved && (
        <div className="mb-4 rounded-md bg-emerald-100 p-3 text-center text-sm font-semibold text-emerald-700">
          GRN saved successfully.
        </div>
      )}
      <form onSubmit={submit}>
        <FormField label="GRN Number" className="max-w-xs">
          {text("grnNumber", { readOnly: true })}
        </FormField>

        <SectionHeader>1. Vendor</SectionHeader>
        <div className="grid gap-4 md:grid-cols-3">
          <FormField label="Company / Vendor Name">
            {text("vendorName", {
              required: true,
              placeholder: "Type to search (e.g. D...)",
            })}
          </FormField>
          <FormField label="Vendor ID">{text("vendorId")}</FormField>
          <FormField label="Contact Person">{text("contactPerson")}</FormField>
          <FormField label="Invoice Number">
            {text("invoiceNumber", { required: true })}
          </FormField>
          <FormField label="Invoice Date">
            {text("invoiceDate", { type: "date" })}
          </FormField>
          <FormField label="LR / AWB Number">{text("lrNumber")}</FormField>
          <FormField label="Courier Partner">
            {select("courier", COURIERS, "Select Courier Partner")}
          </FormField>
          <FormField label="Dispatch Date">
            {text("dispatchDate", { type: "date" })}
          </FormField>
          <FormField label="Delivery Date (Auto)">
            {text("deliveryDate", { type: "date", readOnly: true })}
          </FormField>
        </div>

        <SectionHeader>2. GRN Details</SectionHeader>
        <div className="grid gap-4 md:grid-cols-3">
          <FormField label="GRN Date">
            {text("grnDate", { type: "date", readOnly: true })}
          </FormField>
          <FormField label="Received By">
            <input className="input" value={user.name} readOnly />
          </FormField>
          <FormField label="Warehouse / Location">
            {select("warehouse", WAREHOUSES, "Select")}
          </FormField>
          <FormField
            label="Purchase Order Number"
            className="md:col-span-2 md:col-start-1"
          >
            {text("poNumber")}
          </FormField>
          <FormField label="PO Date">
            {text("poDate", { type: "date" })}
          </FormField>
        </div>

        <SectionHeader>3. Item Receive Details</SectionHeader>
        <p className="mb-3 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Each row below will create a separate QC entry.
        </p>
        <ItemRows
          items={form.items}
          onChange={(items) => setForm({ ...form, items })}
        />

        <SectionHeader>4. Packaging Condition</SectionHeader>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Packaging Status">
            {select("packagingStatus", PACKAGING_STATUS, "Select Status")}
          </FormField>
          <FormField label="Damage / Tamper Remarks">
            {text("damageRemarks")}
          </FormField>
        </div>

        <SectionHeader>5. Attachments</SectionHeader>
        <div className="grid gap-4 md:grid-cols-3">
          <FormField label="Upload Invoice">
            <input
              type="file"
              className="input"
              onChange={setFile("invoiceFile")}
            />
          </FormField>
          <FormField label="Packaging Photos">
            <input
              type="file"
              multiple
              className="input"
              onChange={setFile("photos")}
            />
          </FormField>
          <FormField label="Courier Receipt">
            <input
              type="file"
              className="input"
              onChange={setFile("courierReceipt")}
            />
          </FormField>
        </div>

        <SectionHeader>6. Quality Control (QC)</SectionHeader>
        <div className="grid gap-4 md:grid-cols-4">
          <FormField label="QC Status">
            {text("qcStatus", { readOnly: true })}
          </FormField>
          <FormField label="Assigned To">
            {text("qcAssignedTo", { readOnly: true })}
          </FormField>
          <FormField label="Deadline">
            {text("qcDeadline", { readOnly: true })}
          </FormField>
          <FormField label="QC Batch ID">
            {text("qcBatchId", { readOnly: true })}
          </FormField>
        </div>
        <FormField label="Remarks" className="mt-4">
          <textarea
            className="input"
            rows={2}
            value={form.remarks}
            onChange={set("remarks")}
          />
        </FormField>

        <button className="btn-primary mt-6 w-full py-3">
          Save &amp; Submit GRN
        </button>
      </form>
    </FormCard>
  );
}
