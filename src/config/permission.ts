import { UserRole } from '../entities/enum';

export const PERMISSIONS = {
  [UserRole.ADMIN]: {
    projects: ['create', 'read', 'update', 'delete'],
    tasks: ['create', 'read', 'update', 'delete'],
    users: ['create', 'read', 'update', 'delete'],
  },

  [UserRole.MANAGER]: {
    projects: ['create', 'read', 'update'],
    tasks: ['create', 'read', 'update'],
    users: ['read'],
  },

  [UserRole.MEMBER]: {
    projects: ['read'],
    tasks: ['read', 'update'],
    users: [],
  },
} as const;