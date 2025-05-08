import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { Toaster } from "react-hot-toast";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex h-screen bg-gray-50'>
      <Sidebar />
      <div className='flex-1 flex flex-col overflow-hidden'>
        <Topbar />
        <main className='flex-1 overflow-y-auto'>
          <div className='container mx-auto px-6 py-8'>{children}</div>
        </main>
      </div>
      <Toaster />
    </div>
  );
}
