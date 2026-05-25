import { redirectIfAuthenticated } from "../../lib/auth-redirects";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  await redirectIfAuthenticated();

  return <LoginForm />;
}
