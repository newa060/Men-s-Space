import SideNavBar from "@/components/layout/SideNavBar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dark">
      <div className="flex min-h-screen bg-background text-on-background">
        <SideNavBar />
        <main className="flex-1 flex flex-col min-h-screen" style={{ marginLeft: "280px" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
