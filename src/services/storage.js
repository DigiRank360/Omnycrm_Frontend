// localStorage-backed store; swap for real API calls later.
const read = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || []
  } catch {
    return []
  }
}

const write = (key, data) => localStorage.setItem(key, JSON.stringify(data))

export const grnService = {
  list: () => read('crm_grns'),
  nextNumber: () => {
    const n = read('crm_grns').length + 1
    return `GRN-${new Date().getFullYear()}-${String(n).padStart(5, '0')}`
  },
  save: (grn) => write('crm_grns', [...read('crm_grns'), grn]),
}

export const qcService = {
  list: () => read('crm_qcs'),
  save: (qc) => write('crm_qcs', [...read('crm_qcs'), qc]),
}
