import { Post } from "@prisma/client";

interface CommentSectionProps {
    post: Post & {
        _count: {
          likes: number;
          comments: number;
        };
        user: {
          imageUrl: string | null;
          username: string | null;
        };
      }
}

export const CommentSection = ({ post }: CommentSectionProps) => {
    return (
        <div className="border-t-[1px]">
            comment
        </div>
    )
}