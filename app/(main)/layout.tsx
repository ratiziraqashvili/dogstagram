import { MobileBottomNavbar } from "@/components/mobile-bottom-navbar";
import { MobileNavbar } from "@/components/mobile-navbar";
import { Sidebar } from "@/components/sidebar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="md:hidden w-full flex flex-col">
        <MobileNavbar />
        <MobileBottomNavbar />
      </div>
      <main className="">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
