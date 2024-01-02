import { MainPosts } from "@/components/main-posts";
import { ProfileIndicator } from "@/components/profile-indicator";


export default async function Home() {
  return (
    <div className="">
      <div className="flex">
        <MainPosts />
        <ProfileIndicator />
      </div>
    </div>
  );
}
