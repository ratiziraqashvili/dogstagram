import { SinglePost } from "@/types";
import { Comment } from "@prisma/client";

interface CommentSectionProps {
    post: SinglePost;
    comments: Comment[] | undefined;
}

export const CommentSection = ({ post, comments }: CommentSectionProps) => {
    return (
        <div className="md:border-t-[1px]">
            comment
        </div>
    )
}