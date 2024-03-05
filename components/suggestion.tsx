import { SuggestedUsers } from "@/types";
import { ProfilePicture } from "./profile-picture";
import { Button } from "./ui/button";

interface SuggestionProps {
  suggestedUsers: SuggestedUsers;
}

export const Suggestion = ({ suggestedUsers }: SuggestionProps) => {
  return (
    <div className="flex w-full justify-start">
      <div className="flex flex-col pl-12 gap-2">
        <h1 className="text-muted-foreground text-sm font-semibold opacity-90">
          Suggested for you
        </h1>
        <div className="flex flex-col gap-3 w-full">
          {suggestedUsers.map((user) => (
            <div className="flex justify-between">
              <div className="flex gap-2 items-center">
                <ProfilePicture
                  className="w-10 h-10"
                  imageUrl={user.imageUrl}
                />
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">{user.username}</span>
                  <span className="text-xs text-muted-foreground">
                    Suggested for you
                  </span>
                </div>
              </div>
              <Button></Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
