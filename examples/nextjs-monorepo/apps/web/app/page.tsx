import { describeUser } from "../../../packages/domain/user";

export default function Page() {
  return <main>{describeUser({ id: "usr_1", email: "team@six-eyes.dev" })}</main>;
}
