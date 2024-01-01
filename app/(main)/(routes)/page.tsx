import { MobileNavbar } from "@/components/mobile-navbar";

export default async function Home() {
  return (
    <div className="">
      <div className="md:hidden w-full">
        <MobileNavbar />
      </div>
    </div>
  );
}
