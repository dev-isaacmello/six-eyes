export type User = {
  id: string;
  email: string;
};

export function describeUser(user: User) {
  return `User ${user.email}`;
}
