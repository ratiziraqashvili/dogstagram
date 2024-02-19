import { PostInfoType } from "@/types";
import { Post } from "@prisma/client";

export const shuffleArray = (array: PostInfoType) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}