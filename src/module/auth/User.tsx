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
