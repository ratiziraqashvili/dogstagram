export const MobileFollowerCount = () => {
    return (
        <>
            <div className="flex flex-col items-center text-sm">
                <span className="font-semibold">0</span>
                <span className="text-muted-foreground">posts</span>
            </div>
            <div className="flex flex-col items-center text-sm">
                <span className="font-semibold">0</span>
                <span className="text-muted-foreground">followers</span>
            </div>
            <div className="flex flex-col items-center text-sm">
                <span className="font-semibold">0</span>
                <span className="text-muted-foreground">following</span>
            </div>
        </>
    )
}