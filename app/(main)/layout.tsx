import { MobileNavbar } from "@/components/mobile-navbar";
import { Sidebar } from "@/components/sidebar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <div className="hidden md:block h-full">
        <Sidebar />
      </div>
      <main className="">{children}</main>
    </div>
  );
};

export default MainLayout;
