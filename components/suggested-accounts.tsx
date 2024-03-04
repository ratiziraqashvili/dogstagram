interface SuggestedAccountsProps {
    suggestedUsers: unknown;
}

export const SuggestedAccounts = ({ suggestedUsers }: SuggestedAccountsProps) => {
  return (
    <div className="flex flex-col gap-4 md:gap-6 pt-8 w-full">
      <div>
        <h1 className="font-semibold text-md">Suggested</h1>
      </div>
      <div className="flex flex-col gap-4">
        {/* {blockedUser.map((user) => (
          <div
            className="flex justify-between items-center w-full"
            key={user.clerkId}
          >
            <div className="flex items-center gap-3 cursor-pointer">
              <ProfilePicture className="w-11 h-11" imageUrl={user.imageUrl} />
              <div>
                <p className="font-semibold text-sm">{user.username}</p>
                <p className="text-sm text-muted-foreground">
                  {user.firstName}
                </p>
              </div>
            </div>
            <div>
              <Button
                disabled={isLoading}
                onClick={() => onUnblock(user.clerkId)}
                className="h-8"
                variant="default"
              >
                Unblock
              </Button>
            </div>
          </div>
        ))} */}
      </div>
    </div>
  );
};
