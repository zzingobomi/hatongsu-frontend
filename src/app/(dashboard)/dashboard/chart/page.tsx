import ChartView from "@/components/dashboard/chart/ChartView";
import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();

  return <ChartView user={session?.user} />;
}
