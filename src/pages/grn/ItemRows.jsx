export default function ItemRows({ items, onChange }) {
  const update = (i, field, value) =>
    onChange(items.map((it, idx) => (idx === i ? { ...it, [field]: value } : it)))
  const add = () => onChange([...items, { name: '', serial: '', qty: 1 }])
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i))

  return (
    <div className="overflow-x-auto rounded-md border border-slate-200">
      <table className="w-full min-w-[640px] text-sm">
        <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500">
          <tr>
            <th className="p-2">Item Name</th>
            <th className="p-2">Serial No.</th>
            <th className="w-24 p-2">Qty</th>
            <th className="w-24 p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it, i) => (
            <tr key={i} className="border-t border-slate-200">
              <td className="p-2">
                <input className="input" required placeholder="Search Item..." value={it.name}
                  onChange={(e) => update(i, 'name', e.target.value)} />
              </td>
              <td className="p-2">
                <input className="input" required placeholder="Enter Serial No" value={it.serial}
                  onChange={(e) => update(i, 'serial', e.target.value)} />
              </td>
              <td className="p-2">
                <input className="input" type="number" min="1" required value={it.qty}
                  onChange={(e) => update(i, 'qty', e.target.value)} />
              </td>
              <td className="p-2 text-center">
                <button type="button" disabled={items.length === 1} onClick={() => remove(i)}
                  className="btn-danger !px-2 !py-1 text-xs">
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="p-2 text-right">
        <button type="button" onClick={add} className="btn-primary">Add Item Row</button>
      </div>
    </div>
  )
}
