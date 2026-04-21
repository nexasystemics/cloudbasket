export type Role = 'superadmin' | 'admin' | 'manager' | 'user' | 'guest'

export type Permission =
  | 'leads:read'
  | 'leads:write'
  | 'leads:delete'
  | 'users:read'
  | 'users:write'
  | 'users:delete'
  | 'content:read'
  | 'content:write'
  | 'content:delete'
  | 'analytics:read'
  | 'settings:read'
  | 'settings:write'

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  superadmin: [
    'leads:read','leads:write','leads:delete',
    'users:read','users:write','users:delete',
    'content:read','content:write','content:delete',
    'analytics:read','settings:read','settings:write'
  ],
  admin: [
    'leads:read','leads:write','leads:delete',
    'users:read','users:write',
    'content:read','content:write','content:delete',
    'analytics:read','settings:read','settings:write'
  ],
  manager: [
    'leads:read','leads:write',
    'users:read',
    'content:read','content:write',
    'analytics:read','settings:read'
  ],
  user: [
    'leads:read','leads:write',
    'content:read',
  ],
  guest: [
    'content:read',
  ],
}

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}

export function getRolePermissions(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] ?? []
}

export function isAdminRole(role: Role): boolean {
  return ['superadmin', 'admin'].includes(role)
}
