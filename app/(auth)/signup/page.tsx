import { redirectIfAuthenticated } from "../../lib/auth-redirects";
import SignupForm from "./SignupForm";

export default async function SignupPage() {
  await redirectIfAuthenticated();
  
  return <SignupForm />;
}
