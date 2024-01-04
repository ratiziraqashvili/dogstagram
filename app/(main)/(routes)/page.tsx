import { MainPosts } from "@/components/main-posts";
import { ProfileIndicator } from "@/components/profile-indicator";
import { currentUser, redirectToSignIn } from "@clerk/nextjs";


export default async function Home() {
  const user = await currentUser();

  if (!user || !user.id) {
    return redirectToSignIn();
  }

  return (
    <div className="">
      <div className="flex">
        <MainPosts />
        <ProfileIndicator />
      </div>
    </div>
  );
}
