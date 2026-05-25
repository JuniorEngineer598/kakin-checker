import { redirectIfAuthenticated } from "../../lib/auth-redirects";
import ResetPasswordForm from "./ResetPasswordForm";

export default async function ResetPasswordPage() {
  await redirectIfAuthenticated();

  return <ResetPasswordForm />;
}
