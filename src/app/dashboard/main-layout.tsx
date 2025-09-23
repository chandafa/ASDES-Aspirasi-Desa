// This layout component is a wrapper for dashboard pages 
// to exclude elements like the global footer.

export default function DashboardMainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {children}
    </main>
  );
}
