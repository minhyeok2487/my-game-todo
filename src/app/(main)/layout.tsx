export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-slate-100 dark:bg-slate-950 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {children}
    </div>
  );
}
