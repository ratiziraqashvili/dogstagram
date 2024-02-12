import { PostInfoType } from "@/types";


interface SavedPostsProps {
    savedPosts: PostInfoType;
}

export const SavedPosts = ({ savedPosts }: SavedPostsProps) => {
    return (
        <div>
            saved posts
        </div>
    )
}