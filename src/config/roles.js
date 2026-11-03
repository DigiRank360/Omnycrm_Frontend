export const ROLES = {
  ADMIN: 'admin',
  QC: 'qc',
}

export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Administrator',
  [ROLES.QC]: 'QC Department',
}

// Which modules each role can open (mirrors the backend ACCESS map)
export const PERMISSIONS = {
  [ROLES.ADMIN]: ['dashboard', 'grn', 'qc'],
  [ROLES.QC]: ['dashboard', 'qc'],
}

export const hasPermission = (role, permission) => Boolean(PERMISSIONS[role]?.includes(permission))
