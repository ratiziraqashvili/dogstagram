import { MobileBottomNavbar } from "@/components/mobile-bottom-navbar";
import { MobileNavbar } from "@/components/mobile-navbar";
import { Sidebar } from "@/components/sidebar";
import { headers } from 'next/headers';
import { URL } from 'url';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const headersList = headers();
  const fullUrl = headersList.get('referer') || "";
  const parsedUrl = new URL(fullUrl);
  const pathname = parsedUrl.pathname.split("/")[1];

  const shouldHideMobileNavbar = pathname.startsWith("user_");
  return (
    <div className="h-full">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="md:hidden w-full flex flex-col">
        {!shouldHideMobileNavbar && (
          <MobileNavbar />
        )}
        <MobileBottomNavbar />
      </div>
      <main className="">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
