import { redirectToHomeByAuthState } from "./lib/auth-redirects";

export default async function RootPage() {
  await redirectToHomeByAuthState();
}
