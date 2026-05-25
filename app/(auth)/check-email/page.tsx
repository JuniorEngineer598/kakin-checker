import { redirectIfAuthenticated } from "../../lib/auth-redirects";
import CheckEmailCard from "./CheckEmailCard";

export default async function CheckEmailPage() {
  await redirectIfAuthenticated();
  return <CheckEmailCard />;
}
