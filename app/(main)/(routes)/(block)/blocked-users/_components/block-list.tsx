import { ProfilePicture } from "@/components/profile-picture";
import { User } from "@prisma/client"

interface BlockListProps {
    blockedUser: User[];
}

export const BlockList = ({ blockedUser }: BlockListProps) => {
    return (
      <div className="flex flex-col gap-7 pt-8">
            <div className="">
                <h1 className="font-semibold text-md">Your blocked users</h1>
            </div>
          <div>
            {blockedUser.map(user => (
                <div className="flex items-center gap-3" key={user.clerkId}>
                    <ProfilePicture className="w-11 h-11" imageUrl={user.imageUrl} />
                    <p className="font-semibold text-sm">{user.username}</p>
                    <p>{user.firstName}</p>
                </div>
            ))}
          </div>
      </div>
    )
}