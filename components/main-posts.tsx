import { PostInfoType } from "@/types"

interface MainPostsProps {
    posts: PostInfoType;
}

export const MainPosts = ({ posts }: MainPostsProps) => {
    return (
        <div className="flex-1 mx-auto lg:max-w-[60%] md:max-w-[80%] max-w-full xl:ml-[20rem] md:mt-0 mt-[3.8rem]">
            <div></div>
        </div>
    )
}