import { Sidebar } from "@/components/sidebar";
import { NavContainer } from "./nav-container";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="md:hidden w-full flex flex-col">
        <NavContainer />
      </div>
      <main className="h-full w-full">{children}</main>
    </div>
  );
};

export default MainLayout;
