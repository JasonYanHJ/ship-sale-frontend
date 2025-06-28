export type User = {
  id: number;
  name: string;
  email: string;
  roles: Role[];
};

export type Role = {
  id: number;
  name: string;
};

export function hasRoleIn(user: User, roles: string[]) {
  return user.roles.some((role) => roles.includes(role.name));
}
