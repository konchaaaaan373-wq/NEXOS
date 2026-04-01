import { ClinicProvider } from "@/lib/clinic-context";
import { DashboardLayout } from "@/components/dashboard-layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ClinicProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </ClinicProvider>
  );
}
