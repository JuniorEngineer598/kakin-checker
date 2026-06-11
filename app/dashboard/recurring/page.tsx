import PageBackground from "../../components/PageBackground";
import RecurringChargesClient from "./RecurringChargesClient";

export default function RecurringChargesPage() {
  return (
    <PageBackground className="px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <RecurringChargesClient />
      </div>
    </PageBackground>
  );
}
